import { TriangleAlert } from "lucide-react";
import React from "react";

import PageLayout from "@components/layout/PageLayout";
import { useGoBack } from "@utils/navigation";

const RouteErrorFallback: React.FC<{ title: string }> = ({ title }) => {
    const goBack = useGoBack();

    return (
        <PageLayout className="bg-gray-50" title={title}>
            <div className="flex min-h-96 items-center justify-center px-6 text-center">
                <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <TriangleAlert className="h-7 w-7" />
                    </div>

                    <h2 className="mt-4 text-base font-bold text-gray-900">
                        Không thể tải trang
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Vui lòng kiểm tra kết nối mạng và thử lại.
                    </p>

                    <div className="mt-4 flex justify-center gap-3">
                        <button
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 active:bg-gray-50"
                            type="button"
                            onClick={goBack}
                        >
                            Quay lại
                        </button>

                        <button
                            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white active:bg-blue-700"
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Tải lại
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

type RouteErrorBoundaryProps = {
    children: React.ReactNode;
    title: string;
};

type RouteErrorBoundaryState = {
    hasError: boolean;
};
class RouteErrorBoundary extends React.Component<
    RouteErrorBoundaryProps,
    RouteErrorBoundaryState
> {
    constructor(props: RouteErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): RouteErrorBoundaryState {
        return { hasError: true };
    }

    render() {
        const { hasError } = this.state;
        const { children, title } = this.props;

        if (hasError) {
            return <RouteErrorFallback title={title} />;
        }

        return children;
    }
}

export default RouteErrorBoundary;
