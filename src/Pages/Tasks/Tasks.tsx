import React, { useState } from "react";
import { Plus, MoreVertical, Calendar, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  status: "todo" | "in-progress" | "review" | "done";
}

interface Column {
  id: "todo" | "in-progress" | "review" | "done";
  title: string;
  tasks: Task[];
}

const Tasks = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "3",
          title: "Implement user authentication",
          description: "Add JWT authentication to the application",
          priority: "high",
          assignee: "Mike Johnson",
          dueDate: "2024-01-18",
          status: "in-progress",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "4",
          title: "Code review for payment module",
          description: "Review the payment integration code",
          priority: "medium",
          assignee: "Sarah Wilson",
          dueDate: "2024-01-22",
          status: "review",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "5",
          title: "Setup development environment",
          description: "Configure the development environment for the team",
          priority: "low",
          assignee: "Alex Brown",
          dueDate: "2024-01-10",
          status: "done",
        },
      ],
    },
  ]);

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (
    e: React.DragEvent,
    task: Task,
    columnId: string
  ) => {
    setDraggedTask(task);
    setDraggedColumn(columnId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleTouchStart = (
    _e: React.TouchEvent,
    task: Task,
    columnId: string
  ) => {
    setDraggedTask(task);
    setDraggedColumn(columnId);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn(null);
  };

  const handleTouchMove = (e: React.TouchEvent, columnId: string) => {
    if (!isDragging || !draggedTask) return;

    const touch = e.touches[0];
    const columnElement = e.currentTarget as HTMLElement;
    const rect = columnElement.getBoundingClientRect();

    if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
      setDragOverColumn(columnId);
    } else {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedTask || !draggedColumn) return;

    // If dropping in the same column, don't do anything
    if (draggedColumn === targetColumnId) {
      setDraggedTask(null);
      setDraggedColumn(null);
      setDragOverColumn(null);
      setIsDragging(false);
      return;
    }

    const newColumns = columns.map((column) => {
      if (column.id === draggedColumn) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== draggedTask.id),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [
            ...column.tasks,
            { ...draggedTask, status: targetColumnId as Task["status"] },
          ],
        };
      }
      return column;
    });

    setColumns(newColumns);
    setDraggedTask(null);
    setDraggedColumn(null);
    setDragOverColumn(null);
    setIsDragging(false);
  };

  const handleTouchEnd = (_e: React.TouchEvent, targetColumnId: string) => {
    if (!isDragging || !draggedTask || !draggedColumn) {
      setIsDragging(false);
      return;
    }

    // If dropping in the same column, don't do anything
    if (draggedColumn === targetColumnId) {
      setDraggedTask(null);
      setDraggedColumn(null);
      setDragOverColumn(null);
      setIsDragging(false);
      return;
    }

    const newColumns = columns.map((column) => {
      if (column.id === draggedColumn) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== draggedTask.id),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [
            ...column.tasks,
            { ...draggedTask, status: targetColumnId as Task["status"] },
          ],
        };
      }
      return column;
    });

    setColumns(newColumns);
    setDraggedTask(null);
    setDraggedColumn(null);
    setDragOverColumn(null);
    setIsDragging(false);
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white border-red-500";
      case "medium":
        return "bg-blue-500 text-white border-blue-500";
      case "low":
        return "bg-green-500 text-white border-green-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-white";
      case "in-progress":
        return "bg-white";
      case "review":
        return "bg-white";
      case "done":
        return "bg-white";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
        <p className="text-gray-600">
          Manage your project tasks with our Kanban board
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto py-4 px-3">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`flex-shrink-0 w-full md:w-80 ${getStatusColor(
              column.id
            )} rounded-lg p-4 transition-all duration-200 ${
              dragOverColumn === column.id && draggedColumn !== column.id
                ? "ring-2 ring-[#93221d] ring-opacity-30 bg-[#93221d] bg-opacity-5"
                : ""
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            onTouchMove={(e) => handleTouchMove(e, column.id)}
            onTouchEnd={(e) => handleTouchEnd(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 capitalize">
                {column.title}
              </h3>
              <span className="bg-white bg-opacity-50 text-gray-600 text-sm px-2 py-1 rounded-full">
                {column.tasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                  onTouchStart={(e) => handleTouchStart(e, task, column.id)}
                  className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow ${
                    isDragging && draggedTask?.id === task.id
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {task.title}
                    </h4>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}

              <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} />
                <span className="text-sm">Add Task</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
