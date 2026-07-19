"use client";

import { useEffect, useState } from "react";


export default function Dashboard(){


const [stats,setStats] =
useState<any>(null);


const [profile,setProfile] =
useState<any>(null);


const [games,setGames] =
useState<any[]>([]);




useEffect(()=>{


async function load(){


try{


const statsResponse =
await fetch(
"/api/cs2/stats",
{
cache:"no-store"
}
);


const statsData =
await statsResponse.json();

console.log("CS2 STATS DATA:", statsData);

setStats(statsData);





const profileResponse =
await fetch(
"/api/steam/profile",
{
cache:"no-store"
}
);


const profileData =
await profileResponse.json();


setProfile(profileData);






const gamesResponse =
await fetch(
"/api/steam/games",
{
cache:"no-store"
}
);


const gamesData =
await gamesResponse.json();


setGames(
gamesData.games ?? []
);



}catch(error){


console.log(
"Dashboard error",
error
);


}


}



load();


},[]);







const winRate =
stats?.wins != null && stats?.matches
  ? `${Math.round((stats.wins / stats.matches) * 100)}%`
  : "-";

  

return(


<div

className="
min-h-screen
bg-[#05080d]
text-white
pt-24
px-8
pb-8
"

>



<h1

className="
text-5xl
font-black
text-cyan-400
"

>
Oyuncu Paneli
</h1>



<p

className="
mt-2
mb-10
text-gray-300
"

>
RXALIENS hesap kontrol merkezi
</p>






<div

className="
grid
grid-cols-1
md:grid-cols-5
gap-5
mb-8
"

>


<Card

title="Steam"

value={
profile?.name ??
"Yükleniyor..."
}

/>



<Card

title="Steam Level"

value={
profile?.steamLevel ??
"0"
}

/>



<Card

title="RXALIENS Level"

value="1"

/>



<Card

title="XP"

value="0 / 1000"

/>



<Card

title="Coin"

value="100"

/>



</div>
<div

className="
grid
md:grid-cols-2
gap-6
"

>




<div

className="
bg-[#101720]
border
border-cyan-500/20
rounded-3xl
p-6
"

>


<h2

className="
text-xl
font-bold
text-cyan-400
mb-5
"

>

🎮 CS2 İstatistikleri

</h2>




<Row
name="Oyun"
value={stats?.game ?? "..."}
/>

<Row
name="Saat"
value={
stats?.hours != null
? `${stats.hours} Saat`
: "-"
}
/>

<Row
name="Maç"
value={stats?.matches ?? "-"}
/>

<Row
name="Galibiyet"
value={stats?.wins ?? "-"}
/>

<Row
name="Mağlubiyet"
value={stats?.losses ?? "-"}
/>

<Row
name="Kazanma Oranı"
value={winRate}
/>

<Row
name="K/D"
value={stats?.kd ?? "-"}
/>

<Row
name="Headshot"
value={
stats?.headshot != null
? `${stats.headshot}%`
: "-"
}
/>

<Row
name="Rank"
value={stats?.rank ?? "-"}
/>



</div>









<div

className="
bg-[#101720]
border
border-cyan-500/20
rounded-3xl
p-6
"

>


<h2

className="
text-xl
font-bold
text-cyan-400
mb-5
"

>

🏆 Başarımlar

</h2>





<Row

name="Yeni Oyuncu"

value="Açıldı"

/>



<Row

name="100 Saat"

value={
(stats?.hours ?? 0) >= 100
?
"Açıldı"
:
"Kilitli"
}

/>



<Row

name="Rank Sahibi"

value={
stats?.rank
?
"Açıldı"
:
"Kilitli"
}

/>



<Row

name="Veteran"

value={
(stats?.hours ?? 0) >= 1000
?
"Açıldı"
:
"Kilitli"
}

/>



</div>






</div>









<div

className="
mt-8
bg-[#101720]
border
border-cyan-500/20
rounded-3xl
p-6
"

>



<h2

className="
text-xl
font-bold
text-cyan-400
mb-5
"

>

🎮 Oyun Kütüphanesi

</h2>





<div

className="
grid
md:grid-cols-2
gap-4
"

>
{

games.slice(0,10).map((game)=>(


<div

key={game.id}

className="
flex
items-center
gap-4
bg-black/30
rounded-xl
p-4
"

>


<img

src={game.icon}

alt={game.name}

className="
w-12
h-12
rounded-lg
"

/>



<div>


<p

className="
font-bold
text-white
"

>

{game.name}

</p>



<p

className="
text-gray-400
text-sm
"

>

{game.hours} Saat

</p>



</div>



</div>



))


}



</div>



</div>





</div>



);


}









function Card(
{
title,
value
}:any
){


return(


<div

className="
bg-[#101720]
border
border-cyan-500/20
rounded-3xl
p-6
"

>


<p

className="
text-gray-300
text-sm
"

>

{title}

</p>



<p

className="
mt-3
text-2xl
font-black
text-white
"

>

{value}

</p>



</div>


);


}









function Row(
{
name,
value
}:any
){


return(


<div

className="
flex
justify-between
bg-black/30
rounded-xl
p-3
mb-3
"

>


<span

className="
text-gray-300
"

>

{name}

</span>




<span

className="
font-bold
text-cyan-400
"

>

{value}

</span>



</div>


);


}