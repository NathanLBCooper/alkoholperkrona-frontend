
import React, { Component, ReactElement } from 'react';
import { View, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { Icon } from 'react-native-elements';

const styles: {
    summaryRow: ViewStyle,
    summary: ViewStyle,
    icon: TextStyle,
    parentHr: ViewStyle,
    child: ViewStyle,
} = {
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summary: {
        flex: 1
    },
    icon: {
        fontSize: 30
    },
    parentHr: {
        height: 1,
        width: '100%'
    },
    child: {
        padding: 16,
    },
};

type Props = {
    summary: React.ReactElement;
    detail: (React.ReactElement) | (() => React.ReactElement) | (() => Promise<React.ReactElement>);
}

type State = {
    detail: React.ReactElement;
    detailEvaluated: boolean;
    expanded: boolean;
}

export class Accordian extends Component<Props> {
    public state: State = {
        detail: undefined,
        detailEvaluated: false,
        expanded: false
    };

    constructor(props:
        {
            summary: React.ReactElement,
            detail: (React.ReactElement) | (() => React.ReactElement) | (() => Promise<React.ReactElement>)
        }
    ) {
        super(props);

        if (props.detail["call"] == null) {
            this.state.detailEvaluated = true;
            this.state.detail = this.props.detail as React.ReactElement;
        }
    }

    public render(): React.ReactNode {
        const { summary } = this.props;
        const { detail } = this.state;

        return <View>
            <TouchableOpacity style={styles.summaryRow} onPress={this.toggleExpand}>
                <View style={styles.summary}>{summary}</View>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.parentHr} />
            {
                this.state.expanded &&
                <View style={styles.child}>
                    {detail}
                </View>
            }
        </View>;
    }

    public toggleExpand = () => {
        const resolveLazyDetail: ((state: State) => Promise<ReactElement>) = async (state) => {
            const invoked: object = (this.props.detail as (() => object))();
            if (invoked["then"] == null) {
                const promise: Promise<React.ReactElement> = invoked as Promise<React.ReactElement>;
                return promise;

            } else {
                const element: React.ReactElement = invoked as React.ReactElement;
                return Promise.resolve(element);
            }
        }

        const expanding: boolean = !this.state.expanded;
        this.setState({ expanded: expanding });

        if (expanding && !this.state.detailEvaluated) {
            resolveLazyDetail(this.state).then(element => {
                this.setState({
                    detailEvaluated: true, detail: element
                });
            });
        }
    }
}