import React from "react";
import { CalendarDays, Clock3, Info } from "lucide-react";

import PageLayout from "@components/layout/PageLayout";
import { WORKING_HOURS } from "@constants/workingHours";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

export const WorkingHoursPage: React.FC = () => (
    <PageLayout
        className="bg-slate-50"
        name="working-hours"
        title="Giờ làm việc"
    >
        <div className="px-4 pb-7 pt-5">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 p-5 text-white shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/20">
                    <Clock3 className="h-7 w-7" />
                </div>

                <div className="mt-4 text-xl font-bold leading-7">
                    {NGAI_GIAO_ORGANIZATION.organization.fullName}
                </div>

                <div className="mt-1 text-sm leading-5 text-white/90">
                    Thời gian tiếp nhận và giải quyết thủ tục hành chính tại
                    Trung tâm.
                </div>
            </div>

            <div className="mb-3 mt-6 flex items-center gap-2 text-base font-bold text-gray-800">
                <CalendarDays className="h-5 w-5 text-cyan-600" />
                Lịch làm việc
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-4 py-1 shadow-sm">
                {WORKING_HOURS.map(item => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 py-4"
                    >
                        <div className="min-w-0">
                            <div className="text-sm font-semibold leading-5 text-gray-800">
                                {item.days}
                            </div>

                            <div className="mt-1 text-xs leading-5 text-slate-500">
                                {item.period}
                            </div>
                        </div>

                        <div
                            className={`shrink-0 rounded-lg px-2.5 py-2 text-sm font-bold ${
                                item.isClosed
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-cyan-50 text-cyan-700"
                            }`}
                        >
                            {item.time}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-5 text-amber-800">
                <Info className="mt-px h-5 w-5 shrink-0" />

                <span>
                    Trung tâm làm việc từ Thứ Hai đến sáng Thứ Bảy. Nghỉ chiều
                    Thứ Bảy, Chủ nhật và các ngày nghỉ lễ, Tết theo quy định.
                </span>
            </div>
        </div>
    </PageLayout>
);

export default WorkingHoursPage;