export interface ZeptoTypeAheadOption {
    label: string;
    value?: string;
    description?: string;
    children?: ZeptoTypeAheadOption[];
}

export interface TypeaheadOptionProps {
    option: ZeptoTypeAheadOption;
    isActive: boolean;
    onClick: () => void;
}

export interface ZeptoTypeAheadHeaderProps {
    onClose: () => void;
    onBack: () => void;
    currentCategory?: ZeptoTypeAheadOption;
    nestedPath: ZeptoTypeAheadOption[];
}

export interface ZeptoTypeAhead {
    options: ZeptoTypeAheadOption[];
    triggerChar?: string;
    position?: "top" | "bottom" | "cursor";
    activateMode?: "single" | "multiple";
    maxVisibleOptions?: number;
    typeAheadContainerStyles?: React.CSSProperties;
    typeAheadOptionStyles?: React.CSSProperties;
    typeAheadActiveOptionStyle?: React.CSSProperties;
    onSelect?: (option: ZeptoTypeAheadOption) => void;
    searchCallback?: (optionLabel: string, searchText: string) => boolean;
    renderOption?: (props: TypeaheadOptionProps) => React.ReactNode;
    renderHeader?: () => React.ReactNode;
} 