import React, {useState, useEffect} from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, KeyboardAvoidingView } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';

import {DefaultTheme} from '../theme/default'


export default function Report({route, navigation}) {

    const [isLoading, setIsLoading] = useState(true)
    const reportType = route.params.type
    const reportContent = route.params.content
    const [reportReason, setReportReason] = useState(null)


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} enabled={true} style={{flex:1}}>
            <SafeAreaView style={styles.container}>
                <ScrollView>

                    <Text style={styles.headText}>You are about to report the {reportType} ({reportType === 'user' ? `@${reportContent.data.username}` : reportContent.post.data.meta.content_title})</Text>
                    <Text style={styles.headDesc}>Reporting a user or post will send us a request to analyse the content. If we judge the content is unsuitable, the user/post may get deleted, banned, or striked. Please note, an abuse of false reports may result in a temporary ban of your account. Thank you for helping Shaare get better every day!</Text>

                    <Text style={styles.label}>Reason of report</Text>
                    <View style={styles.picker}>
                        <RNPickerSelect
                            style={styles.picker_input}
                            onValueChange={(v)=> setReportReason(v)}
                            items={[
                                {label: 'Nudity/Pornographic content', value: 'Nudity/Pornographic content'},
                                {label: 'Violence', value: 'Violence'},
                                {label: 'Self-mutilation', value: 'Self-mutilation'},
                                {label: 'Intimidation/Bullying', value: 'Intimidation/Bullying'},
                                {label: 'Discrimination', value: 'Discrimination'},
                                {label: 'False informations', value: 'False informations'},
                                {label: 'Unsupported ads', value: 'Unsupported ads'},
                                {label: 'Drugs', value: 'Drugs'},
                                {label: 'Illegal activities', value: 'Illegal activities'},
                                {label: 'Other', value: 'Other'},
                            ]}
                        />
                    </View>


                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:DefaultTheme.colors.dark,
        position:'relative',
        marginHorizontal:16
    },

    headText: {
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.medium,
        fontSize:DefaultTheme.fontSizes.medium,
        marginTop:16
    },
    headDesc: {
        color:DefaultTheme.colors.whites.mid,
        fontFamily:DefaultTheme.fonts.regular,
        fontSize:DefaultTheme.fontSizes.normal,
        marginTop:16,
        marginBottom:8
    },

    label: {
        color:DefaultTheme.colors.whites.full,
        fontFamily:DefaultTheme.fonts.bold,
        fontSize:DefaultTheme.fontSizes.normal,
        marginTop:16
    },
    picker: {
        backgroundColor:DefaultTheme.colors.whites.tier,
        borderRadius:100,
        paddingVertical:12,
        paddingHorizontal:16,
        marginTop:8
    },
    picker_input: {
        color:'red'
    }

})
