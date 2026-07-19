"use client";

import { useEffect, useState } from "react";


export default function Profile(){


const [profile,setProfile] =
useState<any>(null);




useEffect(()=>{


const loadProfile = async()=>{


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


setProfile(data);



}catch(err){


console.log(
"Profil yüklenemedi"
);


}



};



loadProfile();



},[]);






if(!profile){


return(

<div className="
min-h-screen
bg-[#05080d]
text-white
flex
items-center
justify-center
">

Yükleniyor...

</div>

);


}








return(


<div className="
min-h-screen
bg-[#05080d]
text-white
pt-32
px-6
pb-20
">



<div className="
max-w-5xl
mx-auto
bg-[#101720]
border
border-cyan-500/20
rounded-3xl
p-8
">







<div className="
flex
items-center
gap-6
">


<img

src={profile.avatar}

alt="avatar"

className="
w-28
h-28
rounded-full
border
border-cyan-400/40
"

/>



<div>


<h1 className="
text-4xl
font-black
text-white
">

{profile.name}

</h1>



<p className="
text-cyan-400
mt-2
">

Steam Oyuncusu

</p>



<p className="
text-gray-400
mt-2
">

{profile.status}

</p>



</div>



</div>









<div className="
grid
md:grid-cols-3
gap-5
mt-10
">



<Card

title="Steam Level"

value={
profile.steamLevel ?? "41"
}

/>



<Card

title="RXALIENS Level"

value="1"

/>



<Card

title="Coin"

value={
profile.coin ?? "100"
}

/>



</div>









<div className="
grid
md:grid-cols-2
gap-5
mt-6
">







<div className="
bg-[#0b1119]
border
border-cyan-500/20
rounded-2xl
p-5
">


<p className="
text-gray-400
text-sm
">

Ülke

</p>



<div className="
flex
items-center
gap-3
mt-3
">


<img

src={
profile.countryFlag ??
"https://flagcdn.com/w40/ae.png"
}

alt="flag"

className="
w-10
h-7
rounded
object-cover
"

/>



<p className="
text-cyan-400
font-black
text-xl
">

{
profile.country ??
"Birleşik Arap Emirlikleri"
}

</p>



</div>


</div>









<div className="
bg-[#0b1119]
border
border-cyan-500/20
rounded-2xl
p-5
">


<p className="
text-gray-400
text-sm
">

Durum

</p>



<p className="
text-cyan-400
font-black
text-xl
mt-3
">

{
profile.status ??
"⚫ Çevrimdışı"
}

</p>



</div>









<Card

title="Profil"

value="Steam Bağlı"

/>






<Card

title="Oynadığı Oyun"

value={
profile.game ??
"Boşta"
}

/>







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


<div className="
bg-[#0b1119]
border
border-cyan-500/20
rounded-2xl
p-5
">


<p className="
text-gray-400
text-sm
">

{title}

</p>



<p className="
text-cyan-400
font-black
text-xl
mt-3
">

{value}

</p>



</div>


);


}