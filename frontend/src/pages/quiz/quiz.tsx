// import SystemMessage from "@/components/systemMessage/SystemMessage";
// import BubbleHeader from "@/components/bubbleHeader/bubbleHeader";
// import { useQuizStore } from "@/store/useQuizStore";
// import { useChatStore } from "@/store/useChatStore";

// const Quiz = () => {
//   const {
//     question,
//     isActive,
//   } = useQuizStore();

//   const { systemMessages } = useChatStore();

//   const headerQuestion = isActive && question ? question : "퀴즈가 없습니다";

//   const getCurrentTime = () => {
//     const now = new Date();
//     return now.toTimeString().slice(0, 5);
//   };

//   return (
//     <>
//       <BubbleHeader type="quiz" question={headerQuestion} time={getCurrentTime()} />

//       {/* {!isActive && (
//         <SystemMessage
//           type="quizStart"
//           time={getCurrentTime()}
//         />
//       )} */}

//       {systemMessages.map((msg, index) => (
//         <SystemMessage
//           key={index}
//           type={msg.type}
//           nickName={msg.nickName}
//           time={msg.time}
//         />
//       ))}

//     </>
//   );
// };

// export default Quiz;
