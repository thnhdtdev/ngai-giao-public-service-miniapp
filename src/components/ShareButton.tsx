import clsx from "clsx";
import { Share2 } from "lucide-react";
import React, { useState } from "react";
import { useSnackbar } from "zmp-ui";

import { sharePage, SharePageOptions } from "@utils/share";

interface ShareButtonProps extends SharePageOptions {
    className?: string;
    iconClassName?: string;
    label?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
    className,
    iconClassName = "h-4 w-4",
    label,
    ...shareOptions
}) => {
    const { openSnackbar } = useSnackbar();
    const [sharing, setSharing] = useState(false);

    const handleShare = async () => {
        if (sharing) {
            return;
        }

        setSharing(true);

        try {
            await sharePage(shareOptions);
        } catch {
            openSnackbar({
                text: "Không thể chia sẻ lúc này. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
            });
        } finally {
            setSharing(false);
        }
    };

    return (
        <button
            aria-label={label ?? "Chia sẻ"}
            className={clsx(
                "flex items-center justify-center gap-2 disabled:opacity-60",
                className,
            )}
            disabled={sharing}
            type="button"
            onClick={handleShare}
        >
            <Share2 className={iconClassName} />
            {label}
        </button>
    );
};

export default ShareButton;
