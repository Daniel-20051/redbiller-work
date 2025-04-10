import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";

const people = [
  { id: 1, name: "Management" },
  { id: 2, name: "Customer support" },
  { id: 3, name: "Office assistant" },
  { id: 4, name: "Compliance" },
  { id: 5, name: "Growth" },
  { id: 6, name: "Product" },
  { id: 7, name: "Operations" },
];

function DropDown() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  return (
    <div className="w-[full]  relative ">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <ListboxButton className=" w-[100%] flex items-center gap-3  border-[1px] rounded-t-[5px] border-[#CCCCCC] font-[400] text-[16px] py-[13px] px-[10px] ">
          {selectedPerson.name}
          <img className="mt-[3px] " src="../src/assets/drop-icon.svg" alt="" />
        </ListboxButton>

        <ListboxOptions className=" absolute top-[60px] left-[25px] w-[20%] h-auto  py-[15px] rounded-[15px] bg-[#F7F7F7] ">
          {people.map((person) => (
            <ListboxOption
              key={person.id}
              value={person}
              className=" font-[500] cursor-pointer text-[16px] ml-[15px] mb-[11px] hover:text-primary"
            >
              {person.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
export default DropDown;
