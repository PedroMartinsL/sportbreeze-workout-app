import { TaskCardProps } from "@/components/TaskCard";
import { apiFetch } from "@/services/api";
import Toast from "react-native-toast-message";
import { create } from "zustand";

interface WorkoutState {
  tasks: TaskCardProps[];
  routine: number | null;
  loadTasks: (routine_id: string, access_token: string) => Promise<void>;
  setTasks: (tasks: TaskCardProps[]) => void;
  deleteTask: (task_id: number) => void;
  updateTask: (task: TaskCardProps) => void;
  setRoutine: (id: number) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  tasks: [],
  routine: null,
  loadTasks: async (routine_id: string, access_token: string) => {
    try {
      const data: TaskCardProps[] = await apiFetch({
        path: `/workouts/${routine_id}`,
        method: "GET",
        token: access_token
      });
      set({ tasks: data });  // <- atualiza o state corretamente
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Workout not found',
        text2: e.message || 'Try again later',
        });
    }
  },
  setTasks: (tasks: TaskCardProps[]) => set({ tasks }),

  deleteTask: (task_id: number) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== task_id),
    }));
  },
  updateTask: (updatedTask: TaskCardProps) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    })),
  setRoutine: (id: number) => set({ routine: id }),
}));