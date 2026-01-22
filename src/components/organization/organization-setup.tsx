"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Message from "@/components/ui/message";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { organizationSchema } from "@/components/validation/validation";
import type { OrganizationSchema } from "@/components/validation/validation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GetCountries,
  GetState,
  GetCity,
  GetLanguages,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { INDUSTRY_TYPES, CURRENCY_TYPE } from "@/lib/constants";
import UseTimezone from "@/hooks/use-Timezone";
import { Switch } from "@/components/ui/switch";
import axios from "axios";

const OrganizationSetup = () => {
  const { timezoneOptions } = UseTimezone();
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  // city state country
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [languageList, setLanguageList] = useState<any[]>([]);
  const [country, setCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const form = useForm<OrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      industry: "",
      country: "",
      state: "",
      city: "",
      address: "",
      currency: "",
      language: "",
      timezone: "",
      gstRegistered: false,
      gstNumber: "",
      invoicingMethod: "",
    },
  });
  // organization set up handling >>>>>>>>>>>>>>>
  const {
    mutate,
    isPending: isOrgPending,
    error: orgError,
  } = useMutation({
    mutationFn: async (data: OrganizationSchema) => {
      const response = await axios.post("api/", data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("organization successfully submitted:", data);
      reset();
      router.push(`/${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`);
    },
    onError: (error: any) => {
      console.log("Error:", error);
    },
  });

  // gstresgistered
  const gstRegistered = form.watch("gstRegistered");
  // useEffect gstresgistered
  useEffect(() => {
    if (!gstRegistered) {
      form.setValue("gstNumber", "");
    }
  }, [gstRegistered, form]);
  //  Fetch countries & languages
  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
    GetLanguages().then((result) => {
      setLanguageList(result);
    });
  }, []);
  // fetch states when country changes
  useEffect(() => {
    if (country)
      GetState(parseInt(country)).then((result) => {
        setStateList(result);
      });
  }, [country]);
  useEffect(() => {
    if (selectedState && country)
      GetCity(parseInt(country), parseInt(selectedState)).then((result) => {
        setCitiesList(result);
      });
  }, [country, selectedState]);

  // submit
  const { reset } = form;
  const onSubmit = (data: OrganizationSchema) => {
    console.log("Organization Data:", data);
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Organization Name */}
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Industry */}
        <FormField
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_TYPES.map((item) => (
                      <SelectItem
                        key={`industry-${item.value}`}
                        value={item.value}
                      >
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* country */}
          <FormField
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCountry(value);
                      setSelectedState(null);
                      setCity(null);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countriesList.map((c) => (
                        <SelectItem
                          key={`country-${c.id}-${c.name}`}
                          value={c.id.toString()}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedState(value);
                      setCity(null);
                    }}
                    disabled={!country}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateList.map((c) => (
                        <SelectItem
                          key={`state-${c.id}-${c.name}`}
                          value={c.id.toString()}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* City */}
          <FormField
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCity(value);
                    }}
                    disabled={!selectedState}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {citiesList.map((c) => (
                        <SelectItem
                          key={`city-${c.id}-${c.name}`}
                          value={c.id.toString()}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* address */}
          <FormField
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>address</FormLabel>
                <FormControl>
                  <Input placeholder="london mg road " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Currency */}
          <FormField
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_TYPE.map((curr) => (
                        <SelectItem
                          key={`currency-${curr.value}`}
                          value={curr.value}
                        >
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Language */}
          <FormField
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageList.map((lang) => (
                        <SelectItem
                          key={`lang-${lang.id}-${lang.name}`}
                          value={lang.name}
                        >
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Timezone */}
        <FormField
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezoneOptions.map((option) => (
                      <SelectItem
                        key={`tz-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* gstregistered */}
        <FormField
          name="gstRegistered"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Is this business registered for GST?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GST Number*/}
        {gstRegistered && (
          <FormField
            name="gstNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GST Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Invoicing Method */}
        <FormField
          name="invoicingMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How are you managing Invoicing currently?</FormLabel>
              <FormControl>
                <Input placeholder="Manual / Automatic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-3">
          <Button type="submit" className="" disabled={isOrgPending}>
            {isOrgPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                please wait
              </>
            ) : (
              "Get Started"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className=""
          >
            Go Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrganizationSetup;
