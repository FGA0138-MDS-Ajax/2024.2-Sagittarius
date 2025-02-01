// import { useState, useEffect } from 'react';
// import logo from '../../assets/logo.svg';
// import Sidebar from '../../components/sidebar/sidebar';
// import ControleClientes from '../../components/clientes/clientes';

// function Clientes() {
//   useEffect(() => {
//     document.title = "Pele Dourada - Estoque";
//     const link = document.querySelector('link[rel="icon"]');
//     if (link) {
//       link.href = logo;
//     }
//   }, []);

//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div className={`app-container ${isCollapsed ? "collapsed" : ""}`}>
//       <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//       <main className="main-content">
//         <div>
//           <ControleClientes/>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Clientes;