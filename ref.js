import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Text, ViewBase, } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons"

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #00a8ff;
`;

const Card = styled.View`
  background-color: white;
  height:300px;
  width: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 15px 15px 15px rgba(0,0,0,0.2);
  position: absolute;
`;
const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;
const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;
const CardContainer = styled.View`
  flex: 3;
  justify-content:center;
  align-items:center;
`;
const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function App() {
    // Values
    const scale = useRef(new Animated.Value(1)).current;
    const position = useRef(new Animated.Value(0)).current
    const rotation = position.interpolate({
        inputRange: [-250, 250],
        outputRange: ["-15deg", "15deg"],
        extrapolate: "extend"
    })
    const secondScale = position.interpolate({
        inputRange: [-300, 0, 300],
        outputRange: [1, 0.7, 1],
        extrapolate: "clamp"
    })
    // position.addListener(() => {
    //   console.log(position, rotation)
    // })
    // Animations
    const onPressIn = Animated.spring(scale, { toValue: 0.95, useNativeDriver: true })
    const onPressOut = Animated.spring(scale, { toValue: 1, useNativeDriver: true }) // 상수화, 객체화시킨다.
    const goCenter = Animated.spring(position, { toValue: 0, useNativeDriver: true, })
    const goLeft = Animated.spring(position, {
        toValue: -500, tension: 5, useNativeDriver: true,
        restSpeedThreshold: 300, restDisplacementThreshold: 300,
    })
    const goRight = Animated.spring(position, {
        toValue: 500, tension: 5, useNativeDriver: true,
        restSpeedThreshold: 300, restDisplacementThreshold: 300,
    })
    // Pan Responders
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, { dx }) => {
                //console.log(dx)
                position.setValue(dx)
            },
            onPanResponderGrant: () => onPressIn.start(),
            onPanResponderRelease: (_, { dx }) => {
                if (dx < -250) {
                    goLeft.start(onDismiss)
                } else if (dx > 250) {
                    goRight.start(onDismiss)
                } else {
                    Animated.parallel([
                        onPressOut, goCenter
                    ]).start()
                }
            },
        })
    ).current;
    //state
    const [index, setIndex] = useState(0);
    const onDismiss = () => {
        //Animated.timing(position, { toValue: 0, useNativeDriver: true }).start()
        scale.setValue(1)
        setIndex(prev => prev + 1)
        position.setValue(0)
    }

    const closePress = () => {
        goLeft.start(onDismiss)
    }
    const checkPress = () => {
        goRight.start(onDismiss)
    }
    return (
        <Container>
            <CardContainer>
                <AnimatedCard
                    style={{ transform: [{ scale: secondScale }] }}>
                    {/* <Text>Back Card</Text> */}
                    <Ionicons name={icons[index + 1]} color="#192a56" size={98} />
                </AnimatedCard>
                <AnimatedCard
                    {...panResponder.panHandlers}
                    style={{
                        transform: [
                            { scale },
                            { translateX: position },
                            { rotateZ: rotation }],
                    }}>
                    {/* <Text>Front Card</Text> */}
                    <Ionicons name={icons[index]} color="#192a56" size={98} />
                </AnimatedCard>
            </CardContainer>
            <BtnContainer>
                <Btn onPress={closePress}><Ionicons name='close-circle' color="white" size={58} /></Btn>
                <Btn onPress={checkPress}><Ionicons name='checkmark-circle' color="white" size={58} /></Btn>
            </BtnContainer>
        </Container>
    )
}