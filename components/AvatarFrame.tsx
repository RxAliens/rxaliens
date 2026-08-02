"use client";

import Image from "next/image";

export type FrameItem = { name?: string; effect?: string | null } | null | undefined;

function effectOf(frame: FrameItem) {
  const explicit = frame?.effect?.toLowerCase();
  if (explicit && explicit !== "none") return explicit;
  const name = frame?.name?.toLowerCase() || "";
  if (name.includes("rgb")) return "rgb";
  if (name.includes("cyan") || name.includes("pulse")) return "cyan-pulse";
  if (name.includes("green") || name.includes("alien")) return "alien-green";
  return frame ? "cyan-pulse" : "none";
}

export default function AvatarFrame({src,alt,size=128,frame,className=""}:{src:string;alt:string;size?:number;frame?:FrameItem;className?:string}) {
  const effect = effectOf(frame);
  return <div className={`rx-avatar-frame rx-frame-${effect} ${className}`} style={{width:size,height:size}}>
    <span className="rx-frame-ring" aria-hidden="true" />
    <span className="rx-frame-glow" aria-hidden="true" />
    <Image src={src} alt={alt} width={size} height={size} className="rx-frame-image" />
  </div>;
}
