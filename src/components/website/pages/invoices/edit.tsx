"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { addInvoiceSchema } from "@/components/validation/validation";
import type { AddInvoiceSchema } from "@/components/validation/validation";
import { SearchCombobox } from "@/components/ui/invoices-combobox";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  User,
  MapPin,
  Globe,
  Hash,
  Phone,
  Settings,
  Loader2,
  Receipt,
} from "lucide-react";
const EditInvoices = ()=>{
return(
    <>
    </>
)
}
export default EditInvoices