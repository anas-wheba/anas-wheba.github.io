import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PASSCODE = "secure123"; // Change this to your desired passcode

export default function TierRanking() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [lists, setLists] = useState({});
  const [newListName, setNewListName] = useState("");

  const handleLogin = () => {
    if (passcodeInput === PASSCODE) {
      setAuthenticated(true);
    } else {
      alert("Incorrect passcode. Try again.");
    }
  };

  const createList = () => {
    if (newListName.trim()) {
      setLists({ ...lists, [newListName]: [] });
      setNewListName("");
    }
  };

  const addItem = (listName) => {
    const itemName = prompt("Enter item name:");
    if (itemName) {
      const newItem = { id: `${listName}-${Date.now()}`, name: itemName };
      setLists({ ...lists, [listName]: [...lists[listName], newItem] });
    }
  };

  const onDragEnd = (result, listName) => {
    if (!result.destination) return;
    const items = [...lists[listName]];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLists({ ...lists, [listName]: items });
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Card className="p-6 shadow-lg rounded-lg bg-white">
          <h2 className="text-2xl font-bold mb-4">Enter Passcode</h2>
          <Input 
            type="password"
            value={passcodeInput} 
            onChange={(e) => setPasscodeInput(e.target.value)} 
            placeholder="Passcode"
            className="mb-4"
          />
          <Button onClick={handleLogin}>Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <Input 
          value={newListName} 
          onChange={(e) => setNewListName(e.target.value)} 
          placeholder="Enter your name"
        />
        <Button onClick={createList}>Create List</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(lists).map((listName) => (
          <Card key={listName} className="p-4">
            <h2 className="text-xl font-bold mb-2">{listName}'s Ranking</h2>
            <Button onClick={() => addItem(listName)}>Add Item</Button>
            <DragDropContext onDragEnd={(result) => onDragEnd(result, listName)}>
              <Droppable droppableId={listName}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="mt-2">
                    {lists[listName].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 bg-gray-100 rounded mt-1"
                          >
                            {item.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        ))}
      </div>
    </div>
  );
}
