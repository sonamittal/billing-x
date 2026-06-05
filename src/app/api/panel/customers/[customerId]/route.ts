import { db } from "@/lib/database/db-connect";
import { customer, customerOtherDetails } from "@/drizzle/schema/index";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";
import { putCustomerController } from "@/app/api/panel/customers/[customerId]/putController";
import { putCustomerOtherDetailsController } from "@/app/api/panel/customers/[customerId]/putController";
import { putCAController } from "@/app/api/panel/customers/[customerId]/putController";

// get req
export const GET = async (
  _req: Request,
  { params }: { params: { customerId: string } },
) => {
  try {
    // checking session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session?.user?.id) {
      return Response.json(
        { error: `Please sign in to access this content.` },
        { status: 401 },
      );
    }

    const { customerId } = await params;

    if (!customerId) {
      return Response.json(
        { error: `Customer id is required` },
        { status: 400 },
      );
    }

    // customer data
    const customerData = await db
      .select()
      .from(customer)
      .where(eq(customer.id, customerId))
      .limit(1);

    const customerRow = customerData[0];

    if (!customerRow) {
      return Response.json({ error: `Customer not found.` }, { status: 404 });
    }

    // other details data
    const otherDetailsData = await db
      .select()
      .from(customerOtherDetails)
      .where(eq(customerOtherDetails.customerId, customerId))
      .limit(1);

    const otherDetailsRow = otherDetailsData[0] || null;

    //  response
    return Response.json(
      {
        ...customerRow,
        otherDetails: otherDetailsRow,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `Fetching customer failed. ${error}`
            : "Fetching customer failed.",
      },
      { status: 500 },
    );
  }
};

//PUt req
// export const PUT = async (req: Request, context: any) => {
//   try {
//     // session check
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user?.id) {
//       return Response.json(
//         {
//           success: false,
//           message: "Unauthorized - please login",
//         },
//         { status: 401 },
//       );
//     }
//     // customer id
//     const params = await context.params;
//     const customerId = params.customerId;
//     // body
//     const body = await req.json();

//     // Updated body
//     const updatedBody = {
//       ...body,
//       id: customerId,
//     };
//     console.log("body action =>", body.action);
//     console.log("Updated body =>", updatedBody);

//     //
//     if (body.action === "customer") {
//       return await putCustomerController(updatedBody);
//     }
//     //
//     if (body.action === "otherDetails") {
//       return await putCustomerOtherDetailsController(updatedBody);
//     }
//     return Response.json(
//       {
//         success: false,
//         message: "Invalid action",
//       },
//       { status: 400 },
//     );
//   } catch (error: any) {
//     console.log("error:", error?.message);

//     return Response.json(
//       {
//         success: false,
//         message: error?.message || "Internal Server Error",
//       },
//       { status: 500 },
//     );
//   }
// };

export const PUT = async (
  req: Request,
  { params }: { params: { customerId: string } },
) => {
  try {
    // session check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized - please login",
        },
        { status: 401 },
      );
    }

    const { customerId } = await params;

    if (!customerId) {
      return Response.json(
        {
          success: false,
          message: "Customer id is required",
        },
        { status: 400 },
      );
    }

    const body = await req.json();

    // customer details
    if (body.action === "customer") {
      return await putCustomerController({
        ...body,
        id: customerId,
      });
    }

    // other details
    if (body.action === "otherDetails") {
      return await putCustomerOtherDetailsController({
        ...body,
        id: customerId,
      });
    }

    // billing address
    if (body.action === "billingAddress") {
      return await putCAController({
        ...body,
        id: customerId,
      });
    }

    return Response.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 },
    );
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
