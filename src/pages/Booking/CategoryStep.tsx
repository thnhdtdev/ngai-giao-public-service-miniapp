import { CheckCircle2, ChevronRight, RotateCw } from "lucide-react";
import React from "react";

import { BookingCategory } from "@api/appointments";

type CategoryStepProps = {
    categories?: BookingCategory[];
    loading: boolean;
    error?: string;
    selectedId?: number;
    onRetry: () => void;
    onSelect: (category: BookingCategory) => void;
};

const CategorySkeleton: React.FC = () => (
    <div className="space-y-3">
        {[0, 1, 2, 3].map(item => (
            <div
                className="h-20 animate-pulse rounded-2xl bg-white shadow-sm"
                key={item}
            />
        ))}
    </div>
);

const CategoryStep: React.FC<CategoryStepProps> = ({
    categories,
    loading,
    error,
    selectedId,
    onRetry,
    onSelect,
}) => {
    if (loading) {
        return <CategorySkeleton />;
    }

    if (error || !categories) {
        return (
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
                <p className="m-0 text-sm text-gray-600">
                    {error ?? "Không tải được danh sách lĩnh vực."}
                </p>
                <button
                    className="mx-auto mt-4 flex items-center gap-2 rounded-xl border-0 bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-blue-700"
                    type="button"
                    onClick={onRetry}
                >
                    <RotateCw className="h-4 w-4" />
                    Thử lại
                </button>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="rounded-2xl bg-white p-5 text-center text-sm text-gray-600 shadow-sm">
                Hiện chưa có lĩnh vực nào nhận đặt lịch hẹn.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {categories.map(category => {
                const selected = category.id === selectedId;

                return (
                    <button
                        className={`flex w-full items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm active:bg-gray-50 ${
                            selected
                                ? "border-blue-500 ring-2 ring-blue-100"
                                : "border-gray-100"
                        }`}
                        key={category.id}
                        type="button"
                        onClick={() => onSelect(category)}
                    >
                        <span className="min-w-0 flex-1">
                            <span className="block text-base font-bold leading-6 text-gray-900">
                                {category.name}
                            </span>
                            {category.description && (
                                <span className="mt-0.5 line-clamp-2 block text-sm leading-5 text-gray-500">
                                    {category.description}
                                </span>
                            )}
                        </span>
                        {selected ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                        ) : (
                            <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryStep;
