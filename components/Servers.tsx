"use client";

import { useEffect, useState } from "react";
import SectionTitle from "./ui/SectionTitle";
import FadeUp from "./animations/FadeUp";



const servers = [

{
id:"server1",
host:"185.193.165.123",
port:27015
},

{
id:"server2",
host:"185.193.165.18",
port:27015
},

{
id:"server3",
host:"185.193.165.20",
port:27015
},

{
id:"server4",
host:"185.193.165.22",
port:27015
}

];






function getMapImage(map:string){


if(!map)
return "maps/default.jpg";



const name =
map
.toLowerCase()
.replace("de_","")
.replace("cs_","")
.replace("workshop/","")
.replace(/[^a-z0-9_]/g,"");



return `maps/${name}.jpg`;

}









export default function Servers(){



const [data,setData] =
useState<any>({});







useEffect(()=>{


const load = async()=>{


for(const server of servers){


try{


const res =
await fetch(

`/api/server-status?id=${server.id}&host=${server.host}&port=${server.port}`,

{
cache:"no-store"
}

);



const json =
await res.json();





setData((old:any)=>({

...old,

[server.id]:json

}));





}catch(error){

console.log(error);

}


}


};




load();



const timer =
setInterval(load,10000);



return()=>clearInterval(timer);



},[]);










return(


<section

id="servers"

className="
pt-32
pb-24
"

>



<FadeUp>

<SectionTitle

badge="SUNUCULAR"

title="Aktif Counter-Strike Sunucuları"

description="128 Tick altyapısı, düşük ping ve profesyonel rekabet deneyimi"

/>

</FadeUp>







<div

className="
mt-14
grid
grid-cols-1
md:grid-cols-2
gap-8
max-w-6xl
mx-auto
"

>



{


servers.map((server,index)=>{



const info =
data[server.id];





const percent =
Math.min(

100,

Math.round(

((info?.players ?? 0) /

(info?.maxPlayers || 1))

*100

)

);





const online =
info?.online ?? false;





const barColor =

percent >= 80

?

"bg-red-500"

:

percent >= 50

?

"bg-yellow-400"

:

"bg-cyan-400";





const pingColor =

(info?.ping ?? 0) <= 30

?

"text-emerald-400"

:

(info?.ping ?? 0) <= 70

?

"text-yellow-400"

:

"text-red-400";







return(


<FadeUp

delay={index * 0.15}

key={server.id}

>




<div

className="
overflow-hidden
rounded-3xl
border
border-white/10
bg-[#090d12]
transition
duration-500
hover:-translate-y-2
hover:border-cyan-400/40
"

>





<div

className="
relative
h-52
overflow-hidden
"

>



{/* eslint-disable-next-line @next/next/no-img-element */}
<img

alt={`${server.id} harita görseli`}

src={getMapImage(info?.map)}

onError={(e:any)=>{

e.currentTarget.src =
"maps/default.jpg";

}}

className="
h-full
w-full
object-cover
transition
duration-700
hover:scale-110
"

/>






<div

className={`
absolute
top-5
left-5
rounded-full
px-4
py-2
text-sm
font-bold
text-white
${online ? "bg-emerald-500" : "bg-red-500"}
`}

>

{

online
?

"● AKTİF"

:

"● KAPALI"

}

</div>



</div>







<div className="p-8">





<h3

className="
text-[26px]
font-black
leading-[1.1]
tracking-tight
text-white
"

>

{

info?.name ??

"Sunucu Yükleniyor..."

}

</h3>


<div
className="
mt-2
flex
flex-col
gap-2
"
>

<div
className="
flex
items-center
gap-2
text-xs
text-gray-400
text-xm
font-medium
"
>

<span>
🌐
</span>

<span>
{server.host}:{server.port}
</span>

</div>



<div
className="
mt-0
flex
items-center
gap-2
text-cyan-400
text-xs
font-semibold
"
>

<span>
🗺️
</span>

<span>
{info?.map ?? "-"}
</span>

</div>


</div>







<div

className="
mt-8
grid
grid-cols-2
gap-6
"

>
<div>


<p className="text-gray-500">

Oyuncular

</p>


<h4

className="
text-xl
font-bold
text-white
"

>

{

info?.players ?? 0

}

/

{

info?.maxPlayers ?? 0

}

</h4>


</div>







<div>


<p className="text-gray-500">

Tickrate

</p>


<h4

className="
text-xl
font-bold
text-white
"

>

128 Tick

</h4>


</div>







<div>


<p className="text-gray-500">

Bölge

</p>


<h4

className="
text-xl
font-bold
text-white
"

>

İstanbul

</h4>


</div>







<div>


<p className="text-gray-500">

Ping

</p>


<h4

className={`
text-xl
font-bold
${pingColor}
`}

>

{

info?.ping ?? 0

}

ms

</h4>


</div>





</div>









{

info?.playerList?.length > 0 && (


<div

className="
mt-8
rounded-xl
bg-black/30
p-4
"

>


<h4

className="
text-cyan-400
font-bold
mb-3
"

>

👥 Oyuncular

</h4>





<div

className="
space-y-2
max-h-32
overflow-y-auto
"

>


{

info.playerList.map(

(player:any,i:number)=>(


<div

key={i}

className="
flex
justify-between
text-sm
text-gray-300
"

>


<span>

🎮 {player.name || "Oyuncu"}

</span>



<span

className="
text-cyan-400
"

>

{player.score ?? 0}

</span>



</div>


)


)


}



</div>


</div>


)


}









<div className="mt-8">



<div

className="
flex
justify-between
items-center
mb-2
"

>


<p

className="
text-gray-400
text-sm
"

>

Sunucu Doluluğu

</p>



<p

className="
font-bold
text-cyan-400
"

>

%{percent}

</p>



</div>







<div

className="
h-3
rounded-full
bg-white/10
overflow-hidden
"

>


<div

className={`
h-full
rounded-full
transition-all
duration-700
${barColor}
`}

style={{

width:`${percent}%`

}}


/>



</div>




</div>









<button

className="
mt-8
w-full
rounded-xl
bg-cyan-400
py-4
font-bold
text-black
transition
hover:scale-105
"

onClick={()=>{


window.location.href =

`steam://connect/${server.host}:${server.port}`;


}}

>


▶ Sunucuya Bağlan


</button>






</div>





</div>





</FadeUp>


)


})


}



</div>



</section>


);


}