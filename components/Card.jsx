"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";

export function Card({ id, title, description, thumbnail }) {
  return (
    <CardContainer className="inter-var">
      <CardBody
        className="bg-[--primary] relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-4xl font-dongle font-bold text-[--secondary] dark:text-white">
          {title || "Make things float in air"}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 font-custom text-sm max-w-sm mt-2 text-[--secondary-light] dark:text-neutral-300">
          {description?.substring(0, 100) + (description?.length > 100 ? "..." : "") || 
            "Hover over this card to unleash the power of CSS perspective"}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={thumbnail || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={title || "thumbnail"} />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            as={Link}
            href={`/meetings/${id}`}
            target="_self"
            className="px-4 py-2 rounded-xl text-[--secondary] font-normal text-xs dark:text-white">
            I Want To See →
          </CardItem>
          <CardItem
            translateZ={20}
            as={Link}
            href={`/meetings/${id}`}
            className="px-4 py-2 rounded-xl bg-[--secondary-light] dark:text-black text-[--primary] text-xs font-bold">
            Learn More
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
