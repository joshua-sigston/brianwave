import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"

interface FormFieldComponentProps {
    form: UseFormReturn<any>
    name: string
    label: string
    type: string
    placeholder: string
}

export const FormFieldComponent = ({
    name, 
    label, 
    type, 
    form, 
    placeholder
}: FormFieldComponentProps) => {
    return (
        <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Input type={type} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
    />
    )
}