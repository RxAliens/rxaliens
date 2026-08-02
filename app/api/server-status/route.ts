import { NextResponse } from "next/server";
import { GameDig } from "gamedig";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";



const servers = {

  server1:{
    name:"Competitive #1",
    host:"185.193.165.123",
    port:27015
  },


  server2:{
    name:"Premier #1",
    host:"185.193.165.18",
    port:27015
  },


  server3:{
    name:"Deathmatch #1",
    host:"185.193.165.20",
    port:27015
  },


  server4:{
    name:"Retake #1",
    host:"185.193.165.22",
    port:27015
  }

};






export async function GET(
request:Request
){


const {searchParams} =
new URL(request.url);



const id =
searchParams.get("id")
||
"server1";



const target =
servers[id as keyof typeof servers];





if(!target){


return NextResponse.json({

online:false,

name:"Sunucu bulunamadı",

map:"-",

players:0,

maxPlayers:0,

ping:0,

playerList:[]

});


}





try{



const server:any = await GameDig.query({

type:"csgo",

host:target.host,

port:target.port,

socketTimeout:5000,

givenPortOnly:true


});



const players =

server.players
||
[];





const playerList =

Array.isArray(players)

?

players.map((player:any)=>({

name:
player.name
||
"İsimsiz Oyuncu",


score:
player.score
||
0,


time:
player.time
||
0


}))


:

[];









return NextResponse.json({



online:true,



name:

server.name
||
target.name,



map:

server.map
||
"-",




players:

server.numplayers
??
players.length
??
0,





maxPlayers:

server.maxplayers
||
0,





ping:

Math.round(server.ping || 0),




playerList



});








}catch(error){



console.log(

"SERVER QUERY ERROR:",

error

);




return NextResponse.json({

online:false,

name:target.name,

map:"-",

players:0,

maxPlayers:0,

ping:0,

playerList:[]

});



}


}