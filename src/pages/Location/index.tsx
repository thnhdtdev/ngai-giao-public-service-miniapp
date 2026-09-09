import React from "react";
import { Building2, MapPin } from "lucide-react";

import PageLayout from "@components/layout/PageLayout";
import { NGAI_GIAO_ORGANIZATION } from "@constants/organization";

const CENTER_NAME = NGAI_GIAO_ORGANIZATION.organization.fullName;
const CENTER_ADDRESS = NGAI_GIAO_ORGANIZATION.organization.address.display;

const LocationPage: React.FC = () => (
    <PageLayout
        className="bg-gray-50"
        name="location"
        title="Địa chỉ Trung tâm"
    >
        <main className="px-4 pb-8 pt-4">
            {/* Hero */}
            <section className="rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 p-5 text-white shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                    <MapPin className="h-6 w-6" />
                </div>

                <h2 className="mt-4 text-xl font-bold leading-7">
                    Địa chỉ Trung tâm
                </h2>

                <p className="mt-2 text-sm leading-5 text-white/90">
                    Thông tin địa điểm phục vụ người dân và tổ chức.
                </p>
            </section>

            {/* Center */}
            <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Building2 className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-base font-bold leading-6 text-gray-900">
                            {CENTER_NAME}
                        </div>

                        <div className="mt-3 flex items-start gap-2 text-sm leading-5 text-gray-600">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                            <span>{CENTER_ADDRESS}</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </PageLayout>
);

export default LocationPage;

export { LocationPage };
