// // // import React, { useState } from "react";
// // // import * as S from "./bubbleHeader.style";
// // // import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// // // import Button from "../button/button";
// // // import CountDown from "@/components/countdown/countDown";
// // // import { useModalStore } from "@/store/useModalStore";
// // // import { useVoteStore } from "@/store/useVoteStore";
// // // import {useVoteHandler} from "@/socket/voteHandler";
// // // import VoteResult from "@/components/vote/result/result";
// // //
// // // interface BubbleHeaderProps {
// // //   type: "quiz" | "vote";
// // //   question: string;
// // //   hasVote?: boolean;
// // //   time?: string;
// // // }
// // //
// // // const BubbleHeader: React.FC<BubbleHeaderProps> = ({
// // //                                                      type,
// // //                                                      question,
// // //                                                      hasVote = false,
// // //                                                    }) => {
// // //   const [expanded, setExpanded] = useState(false);
// // //   const { openModal } = useModalStore();
// // //   const{isSave, setIsTimerActive,resetVote,isVoteCreator } = useVoteStore();
// // //   const isCreator = isVoteCreator();
// // //   const { endVote } = useVoteHandler()
// // //   const handleCreateVoteClick = (e: React.MouseEvent) => {
// // //     e.stopPropagation();
// // //     openModal("vote");
// // //   };
// // //
// // //
// // //   const handleVoteClick = (e: React.MouseEvent) => {
// // //     e.stopPropagation();
// // //     openModal("vote");
// // //   };
// // //
// // //
// // //   const handleEndVoteClick = (e: React.MouseEvent) => {
// // //     e.stopPropagation();
// // //     setIsTimerActive(false);
// // //     endVote();
// // //     resetVote();
// // //   };
// // //
// // //   return (
// // //     <S.BalloonContainer onClick={() => setExpanded(!expanded)}>
// // //       <S.ContentRow expanded={expanded}>
// // //         <S.QuestionSection>
// // //           {type === "quiz" ? <S.QLabel>Q</S.QLabel> : <S.VoteIcon />}
// // //           {expanded ? (
// // //             <S.QuestionTextExpanded>{question}</S.QuestionTextExpanded>
// // //           ) : (
// // //             <S.QuestionText title={question}>{question}</S.QuestionText>
// // //           )}
// // //
// // //           {hasVote && isSave && <CountDown />}
// // //         </S.QuestionSection>
// // //
// // //         <S.ToggleIcon>
// // //           {expanded ? <FiChevronUp /> : <FiChevronDown />}
// // //         </S.ToggleIcon>
// // //       </S.ContentRow>
// // //
// // //
// // //       {expanded && (
// // //         <S.ButtonContainer>
// // //           {!hasVote ? (
// // //             <Button onClick={handleCreateVoteClick}>
// // //               투표 만들기
// // //             </Button>
// // //           ) : (
// // //             <S.VoteButtonGroup>
// // //               <Button onClick={handleVoteClick}>
// // //                 투표하기
// // //               </Button>
// // //               { isSave && (
// // //                 <Button onClick={handleEndVoteClick} >
// // //                   투표 종료
// // //                 </Button>
// // //               )}
// // //             </S.VoteButtonGroup>
// // //           )}
// // //         </S.ButtonContainer>
// // //       )}
// // //     </S.BalloonContainer>
// // //   );
// // // };
// // //
// // // export default BubbleHeader;
// //
// // import React, { useState } from "react";
// // import * as S from "./bubbleHeader.style";
// // import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// // import Button from "../button/button";
// // import CountDown from "@/components/countdown/countDown";
// // import { useModalStore } from "@/store/useModalStore";
// // import { useVoteStore } from "@/store/useVoteStore";
// // import { useVoteHandler } from "@/socket/voteHandler";
// // import VoteResult from "@/components/vote/result/result";
// // import {useTimerStore} from "@/store/useTimerStore";
// //
// // interface BubbleHeaderProps {
// //   type: "quiz" | "vote";
// //   question: string;
// //   hasVote?: boolean;
// //   time?: string;
// // }
// //
// // const BubbleHeader: React.FC<BubbleHeaderProps> = ({
// //                                                      type,
// //                                                      question,
// //                                                      hasVote = false,
// //                                                    }) => {
// //   const [expanded, setExpanded] = useState(false);
// //   const [showResult, setShowResult] = useState(false);
// //   const { openModal } = useModalStore();
// //   const {
// //     isSave,
// //     setIsTimerActive,
// //     resetVote,
// //     isVoteCreator,
// //     voteItems
// //   } = useVoteStore();
// //   const isCreator = isVoteCreator();
// //   const { resetTimer } = useTimerStore();
// //   const { endVote } = useVoteHandler();
// //
// //   const handleCreateVoteClick = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     openModal("vote");
// //   };
// //
// //   const handleVoteClick = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     openModal("vote");
// //   };
// //
// //   const handleEndVoteClick = (e: React.MouseEvent) => {
// //     e.stopPropagation();
// //     setIsTimerActive(false);
// //     endVote();
// //     resetVote();
// //     resetTimer()
// //
// //   };
// //
// //   return (
// //     <S.BalloonContainer onClick={() => setExpanded(!expanded)}>
// //       <S.ContentRow expanded={expanded}>
// //         <S.QuestionSection>
// //           {type === "quiz" ? <S.QLabel>Q</S.QLabel> : <S.VoteIcon />}
// //           {expanded ? (
// //             <S.QuestionTextExpanded>{question}</S.QuestionTextExpanded>
// //           ) : (
// //             <S.QuestionText title={question}>{question}</S.QuestionText>
// //           )}
// //
// //           {hasVote && isSave && <CountDown />}
// //         </S.QuestionSection>
// //
// //         <S.ToggleIcon>
// //           {expanded ? <FiChevronUp /> : <FiChevronDown />}
// //         </S.ToggleIcon>
// //       </S.ContentRow>
// //
// //       {expanded && (
// //         <S.ButtonContainer>
// //           {!hasVote ? (
// //             <Button onClick={handleCreateVoteClick}>투표 만들기</Button>
// //           ) : (
// //             <S.VoteButtonGroup>
// //               <Button onClick={handleVoteClick}>투표하기</Button>
// //               {isSave && (
// //                 <Button onClick={handleEndVoteClick}>투표 종료</Button>
// //               )}
// //             </S.VoteButtonGroup>
// //           )}
// //         </S.ButtonContainer>
// //       )}
// //       {showResult && voteItems.length > 0 && (
// //         <VoteResult items={voteItems} />
// //       )}
// //     </S.BalloonContainer>
// //   );
// // };
// //
//
// // export default BubbleHeader;
//
//
//
// import React, { useState } from "react";
// import * as S from "@/components/bubbleHeader/bubbleHeader.style";
// import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// import Button from "../button/button";
// import CountDown from "@/components/countdown/countDown";
// import { useModalStore } from "@/store/useModalStore";
// import { useVoteStore } from "@/store/useVoteStore";
// import { useVoteHandler } from "@/socket/voteHandler";
// import { useTimerStore } from "@/store/useTimerStore";
// import { useQuizStore } from "@/store/useQuizStore";
//
// interface BubbleHeaderProps {
//   type: "quiz" | "vote";
//   question: string;
//   hasVote?: boolean;
//   time?: string;
// }
//
// const BubbleHeader: React.FC<BubbleHeaderProps> = ({
//   type,
//   question,
//   hasVote = false,
//   time,
// }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [showResult, setShowResult] = useState(false);
//   const { openModal } = useModalStore();
//   const {
//     isSave,
//     setIsTimerActive,
//     resetVote,
//     isVoteCreator,
//     voteItems,
//   } = useVoteStore();
//   const isCreator = isVoteCreator();
//   const { resetTimer } = useTimerStore();
//   const { endVote } = useVoteHandler();
//   const { hideQuizQuestion } = useQuizStore();
//
//   const handleCreateVoteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     openModal("vote");
//   };
//
//   const handleVoteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     openModal("vote");
//   };
//
//   const handleEndVoteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     setIsTimerActive(false);
//     endVote(voteItems);
//     resetVote();
//     resetTimer();
//   };
//
//   const handleQuitQuiz = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     hideQuizQuestion();
//   };
//
//   return (
//     <S.BalloonContainer onClick={() => {
//       console.log("클릭됨");
//     setExpanded(!expanded)}}>
//
//       <S.ContentRow expanded={expanded}>
//
//         <S.QuestionSection>
//           {type === "quiz" ? <S.QLabel>Q</S.QLabel> : <S.VoteIcon />}
//           {expanded ? (
//             <S.QuestionTextExpanded>
//               {question}
//               </S.QuestionTextExpanded>
//           ) : (
//             <S.QuestionText title={question}>{question}</S.QuestionText>
//           )}
//           {hasVote && isSave && <CountDown />}
//         </S.QuestionSection>
//
//         <S.ToggleIcon>
//           {expanded ? <FiChevronUp /> : <FiChevronDown />}
//         </S.ToggleIcon>
//
//         <S.TimeText>
//           {time && <S.TimeText>{time}</S.TimeText>}
//         </S.TimeText>
//
//       </S.ContentRow>
//
//       {expanded && type === "quiz" && (
//         <S.ButtonContainer>
//           <Button onClick={handleQuitQuiz}>퀴즈 종료</Button>
//         </S.ButtonContainer>
//       )}
//
//
//
//       {expanded && type === "vote" && (
//         <S.ButtonContainer>
//           {!hasVote ? (
//             <Button onClick={handleCreateVoteClick}>투표 만들기</Button>
//           ) : (
//             <S.VoteButtonGroup>
//               <Button onClick={handleVoteClick}>투표하기</Button>
//               {isSave && (
//                 <Button onClick={handleEndVoteClick}>투표 종료</Button>
//               )}
//             </S.VoteButtonGroup>
//           )}
//         </S.ButtonContainer>
//       )}
//     </S.BalloonContainer>
//   );
// };
//
// export default BubbleHeader;