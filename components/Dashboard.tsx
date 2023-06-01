// import React, { Component, useState, useEffect } from "react";
// // import {
// //   Container,
// //   Row,
// //   Card,
// //   Button,
// //   Form,
// //   Col,
// //   CardGroup,
// //   Accordion,
// // } from "react-bootstrap";
// // import { shallowEqual, useDispatch, useSelector } from "react-redux";
// // import {
// //   BsPlayCircle,
// //   BsArrowRight,
// //   BsFillArrowRightCircleFill,
// // } from "react-icons/bs";
// // import { AiOutlineAudio } from "react-icons/ai";
// // import { GiPlasticDuck } from "react-icons/gi";
// // import { BiSearch } from "react-icons/bi";
// // import { SiAudiomack } from "react-icons/si";
// // import { HiArrowRightCircle } from "react-icons/hi";
// // import Footer from "../Footer/Footer";
// import dateFormat from "dateformat";
// // import { listFreshPosts } from "../../actions/post.action";
// // import { socket } from "../../actions/socket.action";
// // import { LIKE_POST } from "../../actions/types";

// // import { render_like } from "../../helpers/likeHelpers";
// // import { userdetail } from "../../helpers/auth";
// // import ReplyComment from "./ReplyComment";
// // import bgCover from "../../assets/images/nebula.jpg";

// const convertDate = (TZdate) => {
//   let date = new Date(TZdate);
//   return dateFormat(date, "mmmm dd, yyyy");
// };

// const Dashboard = () => {
//   const dispatch = useDispatch();

//   var [param, setParam] = useState({
//     like: [],
//     newPosts: [],
//     active: 0,
//   });

//   const [reply, setReply] = useState(false);
//   useEffect(() => {
//     socket.on("likePost", async (data) => {
//       data = JSON.parse(data);
//       await dispatch({ type: LIKE_POST, payload: data });
//     });
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(listFreshPosts());
//   }, [dispatch]);

//   const freshPosts = useSelector((state) => {
//     if (state.post.data) {
//       return state.post.data;
//     }
//   }, shallowEqual);

//   useEffect(() => {
//     setParam({ ...param, newPosts: freshPosts });
//   }, [freshPosts]);

//   const socketLike = useSelector((state) => {
//     if (state.socket.postLike) {
//       return state.socket.postLike;
//     }
//   });

//   useEffect(() => {
//     if (typeof socketLike !== "undefined" && socketLike.result.length > 0) {
//       let posts = freshPosts.map((p) => {
//         if (p._id === socketLike.post._id) {
//           if (socketLike.status) {
//             let obj = p.Likes.find(
//               (o) =>
//                 o.userId == socketLike.user_id &&
//                 o.postId == socketLike.post._id
//             );
//             if (!obj) {
//               p.Likes.push(socketLike.post);
//             }
//           } else {
//             p.Likes = p.Likes.filter(
//               (item) => item.userId !== socketLike.userId
//             );
//           }
//           return p;
//         } else {
//           return p;
//         }
//       });

//       setParam({ ...param, newPosts: posts });
//     }
//   }, [socketLike]);

//   return (
//     <>
//       <main className="bg-gray-50">
//         <section className="bg-cover bg-center bg-bgCover text-white text-center flex flex-col items-center">
//           <h1 className="bg-transparent pt-20 text-3xl font-bold">DarkDuck</h1>

//           <p className="bg-transparent pt-2 text-2xl w-2/4 pb-3">
//             "Experience the future of comprehensive digital interaction with
//             DarkDuck, an all-in-one solution for housing, supply chain
//             management, musical collaboration, and social connectivity –
//             transforming your online world seamlessly."
//           </p>
//           {/* <p className="bg-transparent pb-10">
//             Audio increases your reach to an audience that simply doesn’t have
//             the time to read.
//           </p> */}
//           <div className=" text-black rounded items-center p-2 m-5 bg-gray-200 dark:bg-gray-400 hover:text-white hover:bg-gray-400 hover:text-lg dark:hover:bg-gray-600 px-3">
//             <button className="flex items-center gap-2 dark:text-white bg-transparent ">
//               View Posts
//               <BsFillArrowRightCircleFill className=" bg-transparent dark:bg-transparent dark:text-white" />
//             </button>
//           </div>
//         </section>
//         <div className="flex flex-col items-center lg:flex-row lg:items-start ">
//           <section className="lg:w-2/3 pb-4 md:px-6 md:w-full">
//             <h1 className="text-3xl font-bold col-span-2 m-auto max-w-3xl space-y-6 overflow-y-auto mt-3 lg:pt-6  dark:text-white">
//               Fresh Posts
//             </h1>
//             <ul>
//               {param?.newPosts && param.newPosts?.length ? (
//                 param.newPosts?.map((freshPost) => {
//                   return (
//                     <li key={freshPost?.userId}>
//                       <div className="col-span-2 m-auto h-full max-w-3xl space-y-6 overflow-hidden overflow-y-auto mt-3 lg:pt-6 ">
//                         <div className="flex rounded-lg border-2 overflow-hidden border-black bg-white dark:border-gray-700 dark:bg-gray-800 flex-col shadow ">
//                           <div className="flex h-full flex-col justify-center gap-3 p-6 pb-0">
//                             <div className="flex items-center space-x-4">
//                               <div className="shrink-0">
//                                 <img
//                                   alt="Portrait Neil Sims"
//                                   src={
//                                     freshPost?.userId?.profilePicture
//                                       ? freshPost?.userId?.profilePicture
//                                       : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
//                                   }
//                                   className="h-10 w-10 rounded-full"
//                                 />
//                               </div>
//                               <div className="min-w-0 flex-1 items-start flex flex-col gap-2 h-20  ">
//                                 <strong className=" justify-self-start p-1 px-2 bg-gray-900 text-gray-50 rounded dark:bg-white dark:text-black ">
//                                   {freshPost.recordModeSwingId?.name}
//                                 </strong>
//                                 <p className="truncate text-sm  font-semibold text-gray-900 dark:text-white">
//                                   {freshPost?.userId.username}
//                                 </p>
//                                 <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
//                                   12 April at 09.28 PM{" "}
//                                   {convertDate(freshPost.createdAt)}
//                                 </p>
//                               </div>
//                               <a
//                                 href="#"
//                                 className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//                               >
//                                 <svg
//                                   stroke="currentColor"
//                                   fill="currentColor"
//                                   strokeWidth="0"
//                                   viewBox="0 0 20 20"
//                                   className="text-2xl"
//                                   height="1em"
//                                   width="1em"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                   <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
//                                 </svg>
//                               </a>
//                             </div>
//                             <div className="space-y-4">
//                               {/* <p className="text-base font-normal text-gray-500 dark:text-gray-400">
//                                 Hi @everyone, the new designs are attached. Go
//                                 check them out and let me know if I missed
//                                 anything. Thanks!
//                               </p> */}
//                               <div className="flex flex-wrap">
//                                 {freshPost?.audio ? (
//                                   <audio controls>
//                                     <source
//                                       src={
//                                         process.env.REACT_APP_AUDIO_PATH +
//                                         freshPost.audio
//                                       }
//                                       type="audio/mp3"
//                                     />
//                                   </audio>
//                                 ) : (
//                                   <></>
//                                 )}
//                               </div>
//                             </div>
//                             <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
//                               <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
//                                 <svg
//                                   stroke="currentColor"
//                                   fill="currentColor"
//                                   stroke-width="0"
//                                   viewBox="0 0 24 24"
//                                   className="mr-2 text-lg"
//                                   height="1em"
//                                   width="1em"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                   <path fill="none" d="M0 0h24v24H0z"></path>
//                                   <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
//                                 </svg>
//                                 <button
//                                   data-accordion-target="#accordion-collapse-body-1"
//                                   aria-expanded="true"
//                                   aria-controls="accordion-collapse-body-1"
//                                   onClick={() => {
//                                     if (
//                                       param.active ===
//                                       "0" + String(freshPost._id)
//                                     ) {
//                                       setParam({ ...param, active: "" });
//                                     } else {
//                                       setParam({
//                                         ...param,
//                                         active: "0" + String(freshPost._id),
//                                       });
//                                     }
//                                     setReply(!reply);
//                                   }}
//                                   eventKey={param.active}
//                                 >
//                                   Reply
//                                 </button>
//                               </a>

//                               <a
//                                 href="#"
//                                 className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
//                               >
//                                 {render_like(freshPost, param.like)}
//                               </a>
//                             </div>
//                             {param.active == "0" + String(freshPost._id) ? (
//                               <div className={reply ? "" : "hidden"}>
//                                 <>
//                                   <ReplyComment />
//                                 </>
//                               </div>
//                             ) : (
//                               <></>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   );
//                 })
//               ) : (
//                 <li>Not Found</li>
//               )}
//             </ul>
//           </section>
//           <aside className="lg:w-1/3 hidden lg:block lg:mt-5">
//             <h3 className="text-xl w-44 relative left-6 top-5 text-gray-600 dark:text-white">
//               Search in Site
//             </h3>
//             <div className="w-full space-y-10 mt-4 px-4 xl:sticky xl:flex xl:flex-col border-l border-black dark:border dark:border-l-1 dark:border-t-0 dark:border-b-0 dark:border-r-0 dark:border-red-700">
//               <button
//                 type="button"
//                 className="DocSearch DocSearch-Button border rounded shadow overflow-hidden"
//                 aria-label="Search"
//                 control-id="ControlID-51"
//               >
//                 <span className="DocSearch-Button-Container flex justify-between p-3 lg:w-[20rem]">
//                   <div className="">
//                     <svg
//                       width="20"
//                       height="20"
//                       className="DocSearch-Search-Icon dark:text-white"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
//                         stroke="currentColor"
//                         fill="none"
//                         fill-rule="evenodd"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       ></path>
//                     </svg>
//                   </div>
//                   <input
//                     className="dark:text-white w-full pl-3
//                   "
//                     placeholder="Search"
//                   />
//                   {/* <span className="DocSearch-Button-Placeholder dark:text-white">
//                     Search
//                   </span> */}
//                 </span>
//               </button>
//               <div>
//                 <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
//                   MOST POPULAR POSTS
//                 </h3>
//                 <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//                   <li className="flex items-center space-x-4 pb-4">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600 dark:bg-purple-600">
//                       <SiAudiomack className=" bg-transparent text-white" />
//                     </div>
//                     <div>
//                       <div className="text-base font-semibold text-gray-900 dark:text-white">
//                         The Large Hadron Collider
//                       </div>
//                       <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                         Read more
//                       </span>
//                     </div>
//                   </li>
//                   <li className="flex items-center space-x-4 py-4">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-400">
//                       <SiAudiomack className=" bg-transparent text-white " />
//                     </div>
//                     <div>
//                       <div className="text-base font-semibold text-gray-900 dark:text-white">
//                         The Large Hadron Collider
//                       </div>
//                       <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                         Read more
//                       </span>
//                     </div>
//                   </li>
//                   <li className="flex items-center space-x-4 pt-4">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-black">
//                       <SiAudiomack className=" bg-transparent text-black" />
//                     </div>
//                     <div>
//                       <div className="text-base font-semibold text-gray-900 dark:text-white">
//                         The Large Hadron Collider
//                       </div>
//                       <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                         Read more
//                       </span>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//               <div className="xl:sticky">
//                 <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
//                   Authors
//                 </h3>
//                 <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//                   <li className="flex items-center space-x-4 pb-4">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold uppercase text-white dark:bg-gray-600">
//                       J
//                     </div>
//                     <div>
//                       <div className="text-base font-semibold text-gray-900 dark:text-white">
//                         Jayne
//                       </div>
//                       <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                         12 posts
//                       </span>
//                     </div>
//                   </li>
//                   <li className="flex items-center space-x-4 pt-4">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold uppercase text-white bg-blue-500 dark:bg-blue-500">
//                       T
//                     </div>
//                     <div>
//                       <div className="text-base font-semibold text-gray-900 dark:text-white">
//                         Thomas
//                       </div>
//                       <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
//                         10 posts
//                       </span>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default Dashboard;
