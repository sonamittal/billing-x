import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import EditBillingAddressForm from "@/components/website/pages/customers/edit-customers/edit-billing-address-form";
import EditShippingAddressForm from "@/components/website/pages/customers/edit-customers/edit-shipping-address-form";
import ContactPersonTable from "@/components/website/pages/customers/edit-customers/contact-person";
import OtherDetailsForm from "@/components/website/pages/customers/edit-customers/other-details";

const EditDetails = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit customers details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="other">
          <TabsList className="grid grid-cols-4 w-fit">
            <TabsTrigger value="other">Other Details</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="contact">Contact Persons</TabsTrigger>
            <TabsTrigger value="remarks">Remarks</TabsTrigger>
          </TabsList>

          {/* Other Details */}
          <TabsContent value="other" className="mt-4">
            <div className="space-y-4">
              <OtherDetailsForm />
            </div>
          </TabsContent>

          {/* Address */}
          <TabsContent value="address" className="mt-7">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-9 w-9 text-green-600 bg-green-100 rounded-md p-1.5" />
                  <div>
                    <h2 className="font-medium text-lg">Billing Address</h2>
                    <h4 className="text-sm font-normal text-gray-500">
                      Primary billing address
                    </h4>
                  </div>
                </div>
                <EditBillingAddressForm />
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-9 w-9 text-green-600 bg-green-100 rounded-md p-1.5" />
                  <div>
                    <h2 className="font-medium text-lg">Shipping Address</h2>
                    <h4 className="text-sm font-normal text-gray-500">
                      Copy billing address
                    </h4>
                  </div>
                </div>
                <EditShippingAddressForm />
              </div>
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact" className="mt-4">
            <div className="space-y-4">
              <ContactPersonTable />
            </div>
          </TabsContent>

          {/* Remarks */}
          <TabsContent value="remarks" className="mt-4">
            <textarea
              className="w-full min-h-25 p-3 rounded-md border bg-background"
              placeholder="Write remarks..."
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EditDetails;
