"use client";


import Image from "next/image";
import { useEffect, useState } from "react";



export default function GamesPage(){


const [games,setGames] =
useState<any[]>([]);



const [search,setSearch] =
useState("");




useEffect(()=>{


const loadGames = async()=>{


const res =
await fetch("/api/steam/games");


const data =
await res.json();


setGames(
data.games ?? []
);


};



loadGames();



},[]);






const filteredGames =
games.filter((game)=>

game.name
.toLowerCase()
.includes(
search.toLowerCase()
)

);






return(


<div className="min-h-screen bg-[#05070b] text-white pt-32 px-6">


<div className="max-w-7xl mx-auto">



<h1 className="
text-5xl
font-black
text-cyan-400
mb-2
">

🎮 Oyun Kütüphanesi

</h1>



<p className="
text-gray-400
mb-10
">

Steam oyun geçmişin ve oynama sürelerin

</p>






<input


value={search}

onChange={(e)=>
setSearch(e.target.value)
}


placeholder="Oyun ara..."


className="
w-full
mb-10
px-6
py-4
rounded-xl
bg-[#101620]
border
border-cyan-500/20
outline-none
"

 />








<div className="

grid

grid-cols-1

sm:grid-cols-2

lg:grid-cols-4

gap-6

">





{

filteredGames.map((game)=> (



<div

key={game.id}

className="
bg-[#111823]
border
border-cyan-500/20
rounded-3xl
overflow-hidden
hover:scale-105
transition
"

>




<div className="
relative
h-52
w-full
">


<Image


src={
game.header ??
game.icon ??
"/images/default-game.jpg"
}


fill


sizes="400px"


alt={game.name}


className="
object-cover
"


/>



</div>







<div className="p-5">


<h2 className="
font-bold
text-lg
truncate
">

{game.name}

</h2>




<div className="
flex
items-center
gap-2
text-cyan-400
mt-4
">

<span>⏱</span>

<span>
{game.hours.toLocaleString("tr-TR")} Saat
</span>

</div>





{

game.hours >= 1000 &&

<p className="
text-yellow-400
text-sm
mt-2
">

👑 En Çok Oynanan

</p>

}




</div>





</div>



))

}



</div>







</div>


</div>



);


}