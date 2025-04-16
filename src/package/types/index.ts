export type ZeptoTypeAheadOption = {
    label: string;
    description?: string;
    value?: string;
    children?: ZeptoTypeAheadOption[];
}

export type ZeptoTypeAheadPosition = 'top' | 'bottom' | 'cursor';

export type ZeptoTypeAheadActivateMode = 'once' | 'multiple';

export type ZeptoTypeAheadHeaderProps = {
    onClose: () => void;
    onBack: () => void;
    currentCategory?: ZeptoTypeAheadOption;
    nestedPath: ZeptoTypeAheadOption[];
}

export type ZeptoTypeAheadWidgetState = {
    isActive: boolean;
    currentSearch: string;
    selectedOption?: ZeptoTypeAheadOption;
}

export type ZeptoTypeAhead = {
    options: ZeptoTypeAheadOption[];
    triggerChar?: string;
    position?: ZeptoTypeAheadPosition;
    activateMode?: ZeptoTypeAheadActivateMode;
    maxVisibleOptions?: number;
    animation?: boolean;
    typeAheadContainerStyles?: React.CSSProperties;
    typeAheadOptionStyles?: React.CSSProperties;
    typeAheadActiveOptionStyle?: React.CSSProperties;
    typeAheadOptionValueStyles?: React.CSSProperties;
    onSelect?: (option: ZeptoTypeAheadOption) => void;
    searchCallback?: (label: string, value: string) => boolean;
    renderOption?: ({ option, isActive }: {
        option: ZeptoTypeAheadOption;
        isActive: boolean;
        onClick: () => void;
    }) => React.ReactNode;
    renderHeader?: (props: ZeptoTypeAheadHeaderProps) => React.ReactNode;
    onWidgetStateChange?: (state: ZeptoTypeAheadWidgetState) => void;
}