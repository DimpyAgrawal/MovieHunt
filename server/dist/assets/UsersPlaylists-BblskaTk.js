import{R as u,r as l,j as s,a as n}from"./index-CxtFXj6h.js";function f(){const[d,m]=l.useState([]),[r,o]=l.useState(!0),x="e350aff8",g=async a=>{try{console.log(a);const e=await n.get(`https://www.omdbapi.com/?i=${a}&apikey=${x}`);return console.log(e.data),e.data}catch(e){return console.log(e),console.error("Error mobbb fetching movie details:",e),null}},h=async()=>{try{const e=(await n.get("/movie/allUsersData",{headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("token")}})).data;console.log(e);const i=await Promise.all(e.map(async c=>{const p=await Promise.all(c.movieLists.map(async t=>{if(t.public){const b=await g(t.id);return{...t,details:b}}return t}));return{...c,movieLists:p}}));console.log(i),m(i),o(!1)}catch(a){console.log("Error fetching all users data here:",a),o(!1)}};return l.useEffect(()=>{h()},[]),s.jsxs("div",{className:"container mx-auto px-4 py-8 sm:px-6 lg:px-8",children:[s.jsx("h1",{className:"text-4xl ml-[5%] font-bold mb-4",children:"Others WishList"}),r&&s.jsx("div",{className:"loader"}),!r&&d.map(a=>s.jsxs("div",{className:"mb-8",children:[s.jsx("h2",{className:"text-3xl ml-[5%] font-semibold mb-4",children:a.name}),s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ml-[5%] mr-[5%]",children:a.movieLists.filter(e=>e.public).map(e=>s.jsx("div",{className:"relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl",children:e.details&&s.jsxs(s.Fragment,{children:[s.jsx("div",{className:"relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white shadow-lg bg-clip-border rounded-xl h-80",children:s.jsx("img",{className:"w-full h-full object-cover",src:e.details.Poster!=="N/A"?e.details.Poster:"https://via.placeholder.com/300x450?text=No+Image",alt:e.details.Title})}),s.jsxs("div",{className:"p-6 text-center",children:[s.jsx("h4",{className:"block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900",children:e.details.Title}),s.jsx("p",{className:"block font-sans text-base text-black antialiased font-medium leading-relaxed",children:e.details.Year})]})]})},e.id))}),s.jsx("hr",{className:"h-px my-8 bg-black border-0 dark:bg-gray-700"})]},a._id))]})}const y=u.memo(f);export{y as default};
