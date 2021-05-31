import { createElement, ReactElement, useEffect } from "react";
import { View, Pressable, Text } from "react-native";
import { isAvailable } from "@mendix/piw-utils-internal";
import { DynamicValue, NativeIcon } from "mendix";

import { GroupIcon } from "./GroupIcon";
import { AnimatedCollapsibleView } from "./CollapsibleView";
import { GroupsType, IconEnum } from "../../typings/AccordionProps";
import { AccordionGroupStyle } from "../ui/Styles";


export interface AccordionGroupProps {
    index: number;
    icon: IconEnum;
    iconCollapsed: DynamicValue<NativeIcon> | undefined;
    iconExpanded: DynamicValue<NativeIcon> | undefined;
    group: GroupsType;
    isExpanded: boolean;
    collapseGroup: (index: number) => void;
    expandGroup: (index: number) => void;
    onPressGroupHeader: (group: GroupsType, index: number) => void;
    visible: DynamicValue<boolean>;
    style: AccordionGroupStyle;
}


export function AccordionGroup(
    {
        index,
        icon,
        iconCollapsed,
        iconExpanded,
        group,
        isExpanded,
        expandGroup,
        onPressGroupHeader,
        visible,
        style,
    }: AccordionGroupProps): ReactElement | null {

    useEffect(() => {
        if (group.groupAttribute && isAvailable(group.groupAttribute) && group.groupAttribute?.value === false) {
            expandGroup(index);
        }
    }, [group.groupAttribute]);

    useEffect(() => {
        if (group.groupCollapsedDynamic && isAvailable(group.groupCollapsedDynamic) &&
            (group.groupCollapsed === "groupStartDynamic" && group.groupCollapsedDynamic?.value === false)
        ) {
            expandGroup(index);
        }
    }, [group.groupCollapsedDynamic]);

    return visible && (
        <View key={index} style={style.container}>
            <Pressable
                style={[style.header.container, icon === "left" && {flexDirection: "row-reverse"}]}
                onPress={() => onPressGroupHeader(group, index)}
            >
                {group.headerRenderMode === "text" ? (
                    <Text style={style.header.text}>{group.headerText.value}</Text>
                ) : group.headerContent}
                {icon !== "no" && <GroupIcon
                    isExpanded={isExpanded}
                    iconCollapsed={iconCollapsed}
                    iconExpanded={iconExpanded}
                    style={style.header.icon}
                />}
            </Pressable>
            <AnimatedCollapsibleView isExpanded={isExpanded} style={style.content}>
                {group.content}
            </AnimatedCollapsibleView>
        </View>
    );
}