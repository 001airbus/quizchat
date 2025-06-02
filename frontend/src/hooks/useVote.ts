
import { useModalStore } from "@/store/useModalStore";
import { useVoteStore } from "@/store/useVoteStore";

export const useVote = () => {
	const { closeModal } = useModalStore();
	const { isSave, setIsSave,isVote,setIsTimerActive} = useVoteStore();

	const save = async (data: any) => {
		console.log("save", data);
		setIsSave(true);
		closeModal("vote");
		setIsTimerActive(true);
	};

	const edit = async (id: number, data: any) => {
		console.log("edit", id, data);
		setIsSave(false);
		setIsTimerActive(false);
	};

	const cancel = () => {
		closeModal("vote");
		setIsSave(false);
		setIsTimerActive(false);
	};
const vote =(id:number)=>{
	isVote(id)
}

	return { isSave, save, edit, cancel,vote };
};