// import styled from "styled-components";
// import React, { useEffect, useState } from "react";

// import { Rate, RateProps } from "antd";

// import clsx from "clsx";
// import RatingSwitch from "apps/sc-admin/helper/RatingSwitch";

// export const GemIcon = ({ ...props }) => {
//   return (
//     <svg width="16" height="16" viewBox="0 0 20 20" {...props}>
//       <path d="M13.5053607,5.04439064 L9.74070334,19 L5.50545741,5.04439064 L13.5053607,5.04439064 Z M18.9870387,5.04439064 L10.4308693,18.3992635 L14.0334588,5.04439064 L18.9870387,5.04439064 Z M4.97271565,5.04439064 L9.01992007,18.3804984 L0.0261267988,5.04439064 L4.97271565,5.04439064 Z M2.59078848,0.271539548 L4.74971934,4.53995157 L4.88498131e-15,4.53995157 L2.59078848,0.271539548 Z M9.25628596,0.137409201 L13.2645553,4.53995157 L5.69339686,4.53995157 L9.25628596,0.137409201 Z M16.4092115,0.271489104 L19,4.53995157 L14.2502807,4.53995157 L16.4092115,0.271489104 Z M15.9760782,0 L13.7766814,4.34836562 L9.81775698,0 L15.9760782,0 Z M8.71400179,-2.66453526e-15 L5.21244944,4.32677563 L3.02392181,-2.66453526e-15 L8.71400179,-2.66453526e-15 Z" />
//     </svg>
//   );
// };
// const RatingWrapper = styled.div`
//   button.jt-rating {
//     background-color: transparent;
//     border: none;
//     outline: none;
//     cursor: pointer;
//   }
//   svg {
//     width: 1.2rem;
//   }
//   .on svg {
//     fill: #fdc60a;
//   }
//   .off svg {
//     fill: #ccc;
//   }
// `;

// export const StarRatingAdmin = ({ onChange, className, setState, ratingIndex }: any) => {
//   const [rating, setRating] = useState(0);
//   const [hover, setHover] = useState(0);

//   useEffect(() => {
//     setRating(ratingIndex);
//   }, [ratingIndex]);

//   return (
//     <RatingWrapper className="App">
//       <form className={clsx("star-rating", className)} onChange={onChange}>
//         {[...Array(5)].map((star, index) => {
//           index += 1;
//           return (
//             <button
//               type="button"
//               key={index}
//               className={clsx("jt-rating", index <= (hover || rating) ? "on" : "off")}
//               onClick={() => {
//                 setRating(index);
//                 setState(index);
//               }}
//               onMouseEnter={() => setHover(index)}
//               onMouseLeave={() => setHover(rating)}
//             >
//               <GemIcon className="star w-5 h-5" />
//             </button>
//           );
//         })}
//       </form>
//     </RatingWrapper>
//   );
// };

// export const ViewRating = ({
//   pointer = true,
//   onChange,
//   className,
//   rating,
//   landPageCss,
//   gap,
//   showText,
//   showStatus = true,
// }: any) => {
//   // const [rating, setRating] = useState(0);
//   // const [hover, setHover] = useState(0);
//   return (
//     <RatingWrapper className="App">
//       <div className={clsx("flex items-center ", gap ? gap : "gap-4")}>
//         <div className="mt-1">
//           <form className={clsx("star-rating flex items-center", className)} onChange={onChange}>
//             {[...Array(5)].map((star, index) => {
//               index += 1;
//               return (
//                 <button
//                   type="button"
//                   key={index}
//                   className={clsx("jt-rating !cursor-default", index <= rating ? "on" : "off")}
//                 >
//                   <GemIcon
//                     className={clsx(
//                       "star",
//                       landPageCss ? landPageCss : "w-5 h-5",
//                       pointer ? "" : "cursor-default"
//                     )}
//                   />
//                 </button>
//               );
//             })}
//           </form>
//         </div>
//         {!showText && showStatus && <RatingSwitch rating={rating} />}
//       </div>
//     </RatingWrapper>
//   );
// };

// export const SCGemRating = styled(Rate).attrs({
//   count: 5,
//   character: <GemIcon className={"w-5 h-5"} />,
// })`
//   display: flex !important;
//   .ant-rate-star.ant-rate-star-full {
//     fill: #fdc60a;
//   }
//   .ant-rate-star.ant-rate-star-full,
//   .ant-rate-star.ant-rate-star-zero,
//   .ant-rate-star.ant-rate-star-half.ant-rate-star-active {
//     transition: transform 0s;
//   }

//   .ant-rate-star.ant-rate-star-half.ant-rate-star-active:hover {
//     transform: scale(0.91);
//     fill: #fdc60a;
//   }

//   .ant-rate-star.ant-rate-star-full:hover {
//     transform: scale(0.91);
//     fill: #fdc60a;
//   }

//   .ant-rate-star.ant-rate-star-zero {
//     fill: #ccc;
//     &:hover {
//       transform: scale(0.91);
//     }
//   }
// `;

// export const JTRating = ({ rating, ...props }: any) => {
//   // const ratings = ["bad", "normal", "good", "very good"];

//   return (
//     <div className={"flex gap-5 items-center"}>
//       <SCGemRating {...props} />
//       <span className={"bg-green-600 text-white px-2 rounded-md"}>{rating}</span>
//       <span>Very Good</span>
//     </div>
//   );
// };
