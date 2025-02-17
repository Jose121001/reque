import React, { useState, useEffect } from "react";
import "./Panel_Administracion.css";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import axios from "axios";


const PanelAdministracion = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState(""); // Estado para la sección activa
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
  const [productos, setProductos] = useState([]);

  const [items, setItems] = useState([
    { id: 1, name: "Pizza", cantidad: 100 },
    { id: 2, name: "Hamburguesa", cantidad: 200 },
    { id: 3, name: "Ensalada", cantidad: 300 },
  ]);


  
const finalizeOrderByName = (name) => {
  const updatedFactura = factura.filter(item => item.name !== name);
  setFactura(updatedFactura);
};

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ id: "", name: "", cantidad: "" });
  const [editItem, setEditItem] = useState(null);
  const [factura, setFactura] = useState([]);
  const [isOpen, setIsOpen] = useState(false);



  useEffect(() => {
    if (isOpen) {
      // Hacer la solicitud de Axios para obtener productos
      axios
        .get("http://localhost:3001/factura")
        .then((response) => {
          setFactura(response.data);
        })
        .catch((err) => {
          console.error("Error al obtener los productos:", err);
          setErrorMessage("Hubo un problema al obtener los productos.");
        });
    }
  }, [isOpen]);
  
  
  const handleSectionClick = (section, requiredRole) => {
    if (requiredRole.includes(role)) {
      setActiveSection(section); // Aquí cambiamos la sección activa
      setAccessDeniedMessage("");
    } else {
      setAccessDeniedMessage("No tienes permiso para acceder a esta sección.");
    }
  };

  useEffect(() => {
    const currentUserRole = localStorage.getItem("currentUser");
    setRole(currentUserRole);
  }, []);

  const handleAdminClick = () => {
    if (role === "admin") {
      setActiveSection("userManagement"); // Muestra la sección de administración
      setAccessDeniedMessage(""); // Limpia el mensaje de acceso denegado si está activo
    } else {
      setAccessDeniedMessage("No tienes permiso para acceder a esta sección.");
    }
  };

  const handleGoToCocina = () => {
    if (role === "admin" || role === "cocinero") {
      setActiveSection("cocina");
      setAccessDeniedMessage("");
    } else {
      setAccessDeniedMessage("No tienes permiso para acceder a esta sección.");
    }
  };

 const handleGoToOrdenes = () => {
  if (role === "admin" || role === "mesero") {
    setActiveSection("ordenes");
    setIsOpen(true);  // Abre el panel de órdenes
    setAccessDeniedMessage("");
  } else {
    setAccessDeniedMessage("No tienes permiso para acceder a esta sección.");
    setIsOpen(false);  // Asegúrate de que el panel no se abra si no tiene permisos
  }
};


  const handleGoToInventory = () => {
    if (role === "admin" || role === "mesero" || role === "cocinero") {
      setActiveSection("inventario");
      setAccessDeniedMessage("");
    } else {
      setAccessDeniedMessage("No tienes permiso para acceder a esta sección.");
    }
  };

  const handleCreateUser = (event) => {
    event.preventDefault();
    if (!username || !password || !role) {
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }
    console.log(`Usuario creado: ${username} con el rol: ${role}`);
    setUsername("");
    setPassword("");
    setRole("");
    setErrorMessage("");
  };

  const handleAddItemClick = () => {
    setShowAddForm(true);
    setEditItem(null); // Aseguramos que no se esté editando ningún artículo cuando se agrega uno nuevo
  };
  const handleEditItemClick = (item) => {
    setEditItem(item); // Establecemos el producto a editar
    setShowAddForm(true); // Mostramos el formulario de agregar (pero con datos de edición)
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (newItem.id && newItem.name && newItem.cantidad) {
      setItems((prevItems) => [
        ...prevItems,
        {
          id: newItem.id,
          name: newItem.name,
          cantidad: parseInt(newItem.cantidad),
        },
      ]);
      setNewItem({ id: "", name: "", cantidad: "" });
      setShowAddForm(false);
    }
  };
  const handleEditItemSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editItem.id
            ? {
                ...item,
                name: editItem.name,
                cantidad: parseInt(editItem.cantidad),
              }
            : item
        )
      );
      setEditItem(null); // Limpiar el estado de edición después de actualizar
      setShowAddForm(false);
    }
  };
  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  

// Función para manejar la modificación del usuario
const handleModifyUser = (e) => {
  e.preventDefault();
  // Aquí iría la lógica para actualizar el usuario en la base de datos o en el estado de la aplicación
  //console.log(Usuario modificado: ${username}, Nuevo Rol: ${role});
};

const handleDeleteUser = (e) => {
  e.preventDefault();
  // Aquí iría la lógica para eliminar el usuario en la base de datos o en el estado de la aplicación
  //console.log(Usuario eliminado: ${username});
};

  return (
    <div className="container">
      <div className="sidebar-menu">
        <h2 className="inventory-title">Manejo de Inventario</h2>
        <div className="button-container">
          <button
            className="inventory-button"
            onClick={() =>
              handleSectionClick("inventario", ["admin", "mesero", "cocinero"])
            }
            disabled={
              role !== "admin" && role !== "mesero" && role !== "cocinero"
            }
          >
            Inventario
          </button>
          <button
            className="inventory-button"
            onClick={handleGoToCocina}
            disabled={role !== "admin" && role !== "cocinero"}
          >
            Cocina
          </button>
          <button
            className="inventory-button"
            onClick={handleAdminClick}
            disabled={role !== "admin"}
          >
            Administración
          </button>
          <button
            className="inventory-button"
            onClick={handleGoToOrdenes}
            disabled={role !== "admin" && role !== "mesero"}
          >
            Facturacion
          </button>
        </div>
        <button className="back-button" onClick={onBack}>
          Regresar al Menú Principal
        </button>

        <footer className="sidebar-footer">
          <OutdoorGrillIcon style={{ marginRight: "8px" }} />
          <span>Grill Steak</span>
        </footer>
      </div>

      <div className="main-content">
      {activeSection === "userManagement" && (
    <div className="user-management-panel">
      <h3>Gestión de Usuarios</h3>
      <div className="button-group">
        <button onClick={() => setActiveSection("admin")} className="user-action-button">Agregar Usuario</button>
        <button onClick={() => setActiveSection("modify")} className="user-action-button">Modificar Usuario</button>
        <button onClick={() => setActiveSection("delete")} className="user-action-button">Eliminar Usuario</button>
      </div>
    </div>
     )}


  {activeSection === "admin" && (
    <div className="admin-panel">
      <h3>Gestión de Usuarios</h3>
      <form onSubmit={handleCreateUser} className="create-user-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ingresa un nombre de usuario"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingresa una contraseña"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="Admin">Administrador</option>
            <option value="Mesero">Mesero</option>
            <option value="Cocinero">Cocinero</option>
          </select>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="create-user-button">Crear Usuario</button>
      </form>
    </div>
  )}

  {activeSection === "modify" && (
    <div className="modify-user-panel">
      <h3>Modificar Usuario</h3>
      <form onSubmit={handleModifyUser} className="modify-user-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ingresa el nombre de usuario"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Rol</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="Admin">Administrador</option>
            <option value="Mesero">Mesero</option>
            <option value="Cocinero">Cocinero</option>
          </select>
        </div>
        <button type="submit" className="modify-user-button">Modificar Usuario</button>
      </form>
    </div>
  )}

{activeSection === "delete" && (
    <div className="delete-user-panel">
      <h3>Eliminar Usuario</h3>
      <form onSubmit={handleDeleteUser} className="delete-user-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ingresa el nombre de usuario a eliminar"
          />
        </div>
        <div className="confirmation-message">
          <p>¿Estás seguro de que deseas eliminar a este usuario?</p>
        </div>
        <button type="submit" className="delete-user-button">Eliminar Usuario</button>
      </form>
    </div>
  )}
{activeSection === "cocina" && (
  <div className="cocina-panel">
    <h2>Órdenes Actuales</h2>
    {factura.map((facturaItem, index) => (
      <div key={index} className="order-item">
        <div className="factura-item-body">
          <h3 style={{color:'#8a8d75'}}>{facturaItem.name}</h3>
          <p style={{color:'#8a8d75', marginTop:'2px'}}><strong style={{color:'#8a8d75'}}>Cantidad:</strong> {facturaItem.quantity}</p>
        </div>
        <button className="finalizar-button"  onClick={() => finalizeOrderByName(facturaItem.name)}>
          Finalizar Orden
        </button>
      </div>
    ))}
  </div>
        )}

{activeSection === "ordenes" && isOpen && (
  <div className="ordenes-panel">
    <div className="factura-header">
      <h2>Factura</h2>
      <p>Fecha: {new Date().toLocaleDateString()}</p>
    </div>
    
    {factura.map((facturaItem, index) => (
      <div key={index} className="factura-item">
        <div className="factura-item-header">
          <h3>{facturaItem.name}</h3>
        </div>
        <div className="factura-item-body">
          <p><strong>Cantidad:</strong> {facturaItem.quantity}</p>
          <p><strong>Precio unitario:</strong> ${facturaItem.unitPrice.toFixed(2)}</p>
          <p><strong>Total:</strong> ${facturaItem.total.toFixed(2)}</p>
        </div>
      </div>
    ))}
    
    <div className="factura-footer">
      <p><strong>Total general:</strong> ${factura.reduce((total, item) => total + item.total, 0).toFixed(2)}</p>
    </div>
  </div>
)}

        {activeSection === "inventario" && (
          <div className="inventory-panel">
            <h3>Sección de Inventario</h3>
            {/* Contenido de la sección Inventario */}
          </div>
        )}

        {accessDeniedMessage && (
          <div className="access-denied-message">
            <p>{accessDeniedMessage}</p>
          </div>
        )}

        {activeSection === "inventario" && (
          <div className="inventory-container">
            <h2>Inventario de Artículos de Comida</h2>
            <div className="item-list">
              {items.map((item) => (
                <div className="item" key={item.id}>
                  <span>{item.name}</span>
                  <span>{item.cantidad}</span>
                  <div className="item-buttons">
                    <button
                      className="inventory-button"
                      onClick={() => handleEditItemClick(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="inventory-button"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="inventory-button" onClick={handleAddItemClick}>
              Agregar
            </button>
            {showAddForm && (
              <form
                onSubmit={editItem ? handleEditItemSubmit : handleAddItemSubmit}
                className="add-item-form"
              >
                <h3>
                  {editItem ? "Editar Artículo" : "Agregar Nuevo Artículo"}
                </h3>
                <div className="form-group">
                  <label htmlFor="id">ID</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={editItem ? editItem.id : newItem.id}
                    onChange={handleInputChange}
                    required
                    disabled={editItem} // No permitir cambiar el ID en la edición
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editItem ? editItem.name : newItem.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad</label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={editItem ? editItem.cantidad : newItem.cantidad}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="inventory-button">
                  {editItem ? "Guardar Cambios" : "Agregar"}
                </button>
              </form>
            )}
            <button
              className="back-button"
              onClick={() => setActiveSection(null)}
            >
              Regresar al Panel de Inventario
            </button>
          </div>
        )}

        {accessDeniedMessage && (
          <div className="access-denied-message">
            <p>{accessDeniedMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdministracion;
