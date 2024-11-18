'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUser } from "@/lib/actions";
import { wixClientServer } from "@/lib/wixClientServer";
import { members } from "@wix/members";
import Link from "next/link";
import { format } from "timeago.js";

type UserType = {
  contactId?: string | null;
  profile?: {
    nickname?: string | null;
  };
  contact?: {
    firstName?: string | null;
    lastName?: string | null;
    phones?: string[];
  };
  loginEmail?: string | null;
};

type OrderType = {
  _id?: string;
  priceSummary?: {
    subtotal?: {
      amount?: number;
    };
  };
  _createdDate?: string;
  status?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const wixClient = await wixClientServer();

      try {
        const userRes = await wixClient.members.getCurrentMember({
          fieldsets: [members.Set.FULL],
        });

        if (!userRes.member?.contactId) {
          setLoading(false);
          return;
        }

        const orderRes = await wixClient.orders.searchOrders({
          search: {
            filter: { "buyerInfo.contactId": { $eq: userRes.member.contactId } },
          },
        });

        setUser({
          contactId: userRes.member.contactId,
          profile: {
            nickname: userRes.member.profile?.nickname || undefined,
          },
          contact: {
            firstName: userRes.member.contact?.firstName || undefined,
            lastName: userRes.member.contact?.lastName || undefined,
            phones: userRes.member.contact?.phones || [],
          },
          loginEmail: userRes.member.loginEmail || undefined,
        });
        setOrders(orderRes.orders);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Not logged in!</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-24 md:h-[calc(100vh-180px)] items-start px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <form action={updateUser} className="space-y-6">
          <input type="hidden" name="id" value={user.contactId || ""} />
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={user.profile?.nickname || ""}
              placeholder="john"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={user.contact?.firstName || ""}
              placeholder="John"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Surname</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={user.contact?.lastName || ""}
              placeholder="Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={user.contact?.phones?.[0] || ""}
              placeholder="+1234567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.loginEmail || ""}
              placeholder="john@example.com"
            />
          </div>
          
          <Button type="submit">Update Profile</Button>
        </form>
      </div>
      
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              href={`/orders/${order._id}`}
              key={order._id}
              className="flex justify-between items-center px-4 py-3 rounded-md hover:bg-green-50 even:bg-slate-100 transition-colors"
            >
              <span className="w-1/4 truncate">{order._id?.substring(0, 10)}...</span>
              <span className="w-1/4">${order.priceSummary?.subtotal?.amount?.toFixed(2) || '0.00'}</span>
              {order._createdDate && (
                <span className="w-1/4">{format(order._createdDate)}</span>
              )}
              <span className="w-1/4">{order.status || 'Unknown'}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


// import UpdateButton from "@/components/UpdateButton";
// import { updateUser } from "@/lib/actions";
// import { wixClientServer } from "@/lib/wixClientServer";
// import { members } from "@wix/members";
// import Link from "next/link";
// import { format } from "timeago.js";

// const ProfilePage = async () => {
//   const wixClient = await wixClientServer();

//   const user = await wixClient.members.getCurrentMember({
//     fieldsets: [members.Set.FULL],
//   });

//   if (!user.member?.contactId) {
//     return <div className="">Not logged in!</div>;
//   }

//   const orderRes = await wixClient.orders.searchOrders({
//     search: {
//       filter: { "buyerInfo.contactId": { $eq: user.member?.contactId } },
//     },
//   });

//   return (
//     <div className="flex flex-col md:flex-row gap-24 md:h-[calc(100vh-180px)] items-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
//       <div className="w-full md:w-1/2">
//         <h1 className="text-2xl">Profile</h1>
//         <form action={updateUser} className="mt-12 flex flex-col gap-4">
//           <input type="text" hidden name="id" value={user.member.contactId} />
//           <label className="text-sm text-gray-700">Username</label>
//           <input
//             type="text"
//             name="username"
//             placeholder={user.member?.profile?.nickname || "john"}
//             className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
//           />
//           <label className="text-sm text-gray-700">First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             placeholder={user.member?.contact?.firstName || "John"}
//             className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
//           />
//           <label className="text-sm text-gray-700">Surname</label>
//           <input
//             type="text"
//             name="lastName"
//             placeholder={user.member?.contact?.lastName || "Doe"}
//             className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
//           />
//           <label className="text-sm text-gray-700">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             placeholder={
//               (user.member?.contact?.phones &&
//                 user.member?.contact?.phones[0]) ||
//               "+1234567"
//             }
//             className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
//           />
//           <label className="text-sm text-gray-700">E-mail</label>
//           <input
//             type="email"
//             name="email"
//             placeholder={user.member?.loginEmail || "john@gmail.com"}
//             className="ring-1 ring-gray-300 rounded-md p-2 max-w-96"
//           />
//           <UpdateButton />
//         </form>
//       </div>
//       <div className="w-full md:w-1/2">
//         <h1 className="text-2xl">Orders</h1>
//         <div className="mt-12 flex flex-col">
//           {orderRes.orders.map((order) => (
//             <Link
//               href={`/orders/${order._id}`}
//               key={order._id}
//               className="flex justify-between px-2 py-6 rounded-md hover:bg-green-50 even:bg-slate-100"
//             >
//               <span className="w-1/4">{order._id?.substring(0, 10)}...</span>
//               <span className="w-1/4">
//                 ${order.priceSummary?.subtotal?.amount}
//               </span>
//               {order._createdDate && (
//                 <span className="w-1/4">{format(order._createdDate)}</span>
//               )}
//               <span className="w-1/4">{order.status}</span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
