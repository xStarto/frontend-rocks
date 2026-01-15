import { useState, useEffect } from "react";
import { Link } from "react-router";

export const Root = () => {
  return (
    <div className="pt-10 pl-10 flex justify-start flex-wrap items-start h-screen">
      <Card title="Bulbasaur" image="https://www.clipartmax.com/png/middle/38-382977_1-pokemon-bulbasaur.png" />
    </div>
  );
  
}
export const Card = (props : { title: string, image : string }) => {
  return <div className="bg-gray-300 h-40 w-40 text-up flex justify-center rounded-md" title={props.title} image={props.image}>{props.title}</div>;
};