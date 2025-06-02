import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

const App = lazy(() => import("@/App"));
const Vote =lazy(()=>import("@/pages/vote/vote"))
const Chat = lazy(()=>import("@/pages/Chat/chat"))
const Quiz=lazy(()=>import("@/pages/quiz/quiz"))
const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<App />
			</Suspense>
		),
		children: [
			{
				path: "",
				element: <Chat />,
			},
			{
				path: "vote",
				element: <Vote />,
			},
			{
				path: "quiz",
				element: <Quiz />,
			},
		],
	},
]);

export default router;