import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AlertMessageProps = {
    title: string;
    description: string;
    display_status:boolean;
    onOpenChange: (boolean) => void;
};


export function DisplayAlertMessage({
    title,
    description, 
    display_status, 
    onOpenChange }: AlertMessageProps){
    const [resultDialogContent, setResultDialogContent] = useState({
        description: "This is a sample", 
        onAction: () => {
            onOpenChange(false); 
            window.location.reload()
        },
    });


    return (
        <AlertDialog open={display_status} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={resultDialogContent.onAction}>
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}