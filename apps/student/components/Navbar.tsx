// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Heart, CircleUserRound, ChevronDown } from 'lucide-react';

// import MaxWidthWrapper from './MaxWidthWrapper';
// import NavItems from './NavItems';
// import MobileNav from './MobileNav';
// import CustomModal from './CustomModal';
// import useUser from '../hook/useUser';
// import Logo from '../assets/Logo/Logo.png';

// const Navbar = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const { isAuthenticated, user } = useUser();

//   const handleHeartClick = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);
//   const handleLogout = () => {
//     console.log('User logged out'); // Implement logout logic
//   };

 

//   return (
//     <nav className="bg-white w-full inset-x-0 pt-2 relative z-50">
//       <MaxWidthWrapper className="relative flex justify-between py-1.5 items-center text-dark-blue bg-white h-full px-5 sm:px-10 md:px-14 lg:px-24">
//         {/* Logo and Mobile Navigation */}
//         <div className="flex gap-2">
//           <Link href="/">
//             <Image src={Logo} width={70} height={70} alt="Logo" />
//           </Link>
//           <MobileNav />
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden lg:flex items-center ml-8">
//           <NavItems />
//         </div>

//         {/* User Actions */}
//         <div className="flex items-center space-x-6 relative">
//           <Heart onClick={handleHeartClick} className="cursor-pointer" />

//           {isAuthenticated ? (
//             <div className="relative">
//               {/* Avatar Button */}
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 focus:outline-none"
//               >
//                 {user?.photoPath ? (
//                   <Image
//                     src={user.photoPath}
//                     alt="User Avatar"
//                     width={40}
//                     height={40}
//                     className="rounded-full"
//                   />
//                 ) : (
//                   <CircleUserRound
//                     size={40}
//                     className="text-gray-600 cursor-pointer"
//                   />
//                 )}
//               </button>

//               {/* Dropdown Menu (Always on Top) */}
//               {isDropdownOpen && (
//                 <div
//                   className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border py-2 z-50"
//                   style={{ minWidth: '160px' }}
//                 >
//                   <Link
//                     href="auth/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     My Profile
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link href="/auth/sign-in">
//               <button className="w-full md:w-30 h-10 px-4 py-2 bg-dark-blue text-white flex items-center rounded">
//                 Sign In
//               </button>
//             </Link>
//           )}
//         </div>
//       </MaxWidthWrapper>

//       {/* Modal */}
//       <CustomModal visible={isModalOpen} onClose={handleCloseModal} />
//     </nav>
//   );
// };

// export default Navbar;
