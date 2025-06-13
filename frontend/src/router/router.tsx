import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingPage from "@/pages/loading/loading";

const App = lazy(() => import("@/App"));
const Chat = lazy(()=>import("@/pages/Chat/chat"))
const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense fallback={<LoadingPage />}>
				<App />
			</Suspense>
		),
		children: [
			{
				path: "",
				element: <Chat />,
			},
		],
	},
]);

export default router;