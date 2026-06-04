import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import EditBillingAddressForm from "@/components/website/pages/customers/edit-customers/edit-billing-address-form";
import EditShippingAddressForm from "@/components/website/pages/customers/edit-customers/edit-shipping-address-form";
import ContactPersonTable from "@/components/website/pages/customers/edit-customers/contact-person";
import OtherDetailsForm from "@/components/website/pages/customers/edit-customers/other-details";
import EditRemark from "@/components/website/pages/customers/edit-customers/edit-remark";

const EditDetails = ({
  customer,
  callback,
}: {
  customer: any;
  callback?: string;
}) => {
  const billingAddress = customer?.addresses?.find(
    (a: any) => a.type === "billing",
  );

  const shippingAddress = customer?.addresses?.find(
    (a: any) => a.type === "shipping",
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit customers details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="other">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="flex  items-center gap-5">
              <TabsTrigger value="other">Other Details</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="contact">Contact Persons</TabsTrigger>
              <TabsTrigger value="remarks">Remarks</TabsTrigger>
            </TabsList>
          </div>

          {/* Other Details */}
          <TabsContent value="other" className="mt-4">
            <div className="space-y-4">
              <OtherDetailsForm
                customerId={customer?.id}
                customer={customer}
                callback={callback}
              />
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
                <EditShippingAddressForm
                  customerId={customer.id}
                  addressId={shippingAddress?.id}
                  callback={callback}
                />
              </div>
            </div>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact" className="mt-4">
            <div className="space-y-4">
              <ContactPersonTable
                callback={callback}
                customerId={customer?.id}
              />
            </div>
          </TabsContent>

          {/* Remarks */}
          <TabsContent value="remarks" className="mt-4">
            <div className="space-y-4">
              <EditRemark />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EditDetails;
