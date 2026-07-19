"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Trophy,
  Globe,
  Gamepad2
} from "lucide-react";



const menu = [
  {
    title:"Ana Sayfa",
    href:"/"
  },
  {
    title:"Sunucular",
    href:"#servers"
  },
  {
    title:"Leaderboard",
    href:"#leaderboard"
  },
  {
    title:"Market",
    href:"#market"
  },
  {
 title:"Oyunlar",
 href:"/games"
  },
  {
    title:"Discord",
    href:"https://discordapp.com/users/582001640069136385"
  }
];





export default function Navbar(){


const [user,setUser] =
useState<any>(null);


const [open,setOpen] =
useState(false);


const [mobile,setMobile] =
useState(false);


const [scroll,setScroll] =
useState(false);



const ref =
useRef<HTMLDivElement>(null);







useEffect(()=>{


async function loadUser(){


try{


const res =
await fetch(
"/api/steam/profile",
{
cache:"no-store"
}
);


const data =
await res.json();


setUser(data);



}catch(err){

console.log(
"Steam çekilemedi"
);


}


}



loadUser();



const timer =
setInterval(
loadUser,
30000
);



return()=>clearInterval(timer);



},[]);








useEffect(()=>{


function handleScroll(){


setScroll(
window.scrollY > 20
);


}


window.addEventListener(
"scroll",
handleScroll
);


return()=>{

window.removeEventListener(
"scroll",
handleScroll
);

}


},[]);









useEffect(()=>{


function close(e:any){


if(
ref.current &&
!ref.current.contains(e.target)
){

setOpen(false);

}


}



document.addEventListener(
"mousedown",
close
);



return()=>{

document.removeEventListener(
"mousedown",
close
);

}


},[]);









function logout(){


document.cookie =
"steam_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";


window.location.reload();


}








return(

<nav

className={`
fixed
top-0
left-0
w-full
z-50
transition-all

${
scroll
?
"bg-black/80 backdrop-blur-xl border-b border-cyan-500/20"
:
"bg-transparent"
}

`}

>


<div

className="
max-w-7xl
mx-auto
px-6
h-20
flex
items-center
justify-between
"

>



<Link

href="/"

className="
text-3xl
font-black
tracking-[6px]
text-cyan-400
"

>

RXALIENS

</Link>








<div

className="
hidden
lg:flex
gap-10
"

>


{

menu.map(item=>(


<Link

key={item.title}

href={item.href}

className="
text-gray-300
hover:text-cyan-400
transition
"

>

{item.title}

</Link>


))


}



</div>









<div

ref={ref}

className="
relative
hidden
lg:block
"

>


{

user ? (


<>


<button

onClick={()=>setOpen(!open)}

className="
flex
items-center
gap-3
px-4
py-2
rounded-2xl
border
border-cyan-400/30
bg-white/5
"

>


<Image

src={
user.avatar ||
"/images/default-avatar.png"
}

width={42}
height={42}

alt="avatar"

className="
rounded-full
"

/>




<div className="
text-left
">


<p

className="
text-sm
font-bold
text-white
"

>

{user.name}

</p>


<p

className="
text-xs
text-cyan-400
"

>

{user.status}

</p>



{

user.game &&

<p

className="
text-[10px]
text-gray-400
"

>

🎮 {user.game}

</p>

}



</div>




<ChevronDown size={18}/>


</button>









{

open && (


<div

className="
absolute
right-0
mt-3
w-80
rounded-3xl
bg-[#0b1018]
border
border-cyan-500/20
shadow-xl
overflow-visible
"

>




<div

className="
p-5
border-b
border-cyan-500/10
"

>


<div className="
flex
gap-3
items-center
">


<Image

src={user.avatar}

width={55}

height={55}

alt="avatar"

className="
rounded-full
"

/>



<div>

<p className="
text-white
font-bold
">

{user.name}

</p>


<p className="
text-cyan-400
text-xs
">

{user.status}

</p>


</div>


</div>







<div className="
mt-4
space-y-3
text-sm
text-gray-300
">


<p className="
flex
gap-2
items-center
">

<Trophy size={16}/>

Steam Level:

<span className="
text-cyan-400
font-bold
">

{user.steamLevel}

</span>


</p>






<p className="
flex
gap-2
items-center
">

<Globe size={16}/>

<img

src={user.countryFlag}

alt="flag"

className="
w-5
h-4
rounded
"

/>

{user.country}


</p>







{

user.game &&

<p className="
flex
gap-2
items-center
text-green-400
">

<Gamepad2 size={16}/>

{user.game}

</p>

}



</div>



</div>








<Link

href="/dashboard"

className="
flex
gap-3
items-center
px-5
py-4
text-gray-300
hover:bg-cyan-500/10
"

>

<LayoutDashboard size={18}/>

Dashboard

</Link>







<Link

href="/profile"

className="
flex
gap-3
items-center
px-5
py-4
text-gray-300
hover:bg-cyan-500/10
"

>


<User size={18}/>

Profil

</Link>







<button

onClick={logout}

className="
flex
gap-3
items-center
w-full
px-5
py-4
text-red-400
border-t
border-cyan-500/10
"

>


<LogOut size={18}/>

Çıkış Yap


</button>






</div>


)


}



</>

)


:(


<Link

href="/api/auth/steam"

className="
border
border-cyan-400
px-5
py-2
rounded-xl
text-cyan-400
"

>

Steam Giriş

</Link>


)



}



</div>







<button

className="
lg:hidden
text-cyan-400
"

onClick={()=>setMobile(!mobile)}

>


{

mobile ?

<X size={30}/>

:

<Menu size={30}/>

}



</button>



</div>








{

mobile && (


<div className="
lg:hidden
bg-black/90
border-t
border-cyan-500/20
">


{

menu.map(item=>(


<Link

key={item.title}

href={item.href}

className="
block
px-6
py-4
text-gray-300
"

>

{item.title}

</Link>


))


}



</div>


)


}



</nav>


);



}