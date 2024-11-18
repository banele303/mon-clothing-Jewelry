'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUser } from "@/lib/actions";
import { wixClientServer } from "@/lib/wixClientServer";
import { members } from "@wix/members";
import { orders } from "@wix/ecom";
import Link from "next/link";
import { format } from "timeago.js";

// Update the Order type to match the Wix API response structure
type Order = {
  _id?: string | null;
  priceSummary?: {
    subtotal?: {
      amount?: string;
    };
  };
  _createdDate?: string;
  status?: string;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const wixClient = await wixClientServer();
        
        const userResponse = await wixClient.members.getCurrentMember({
          fieldsets: [members.Set.FULL],
        });

        if (!userResponse.member?.contactId) {
          setError("Not logged in");
          setLoading(false);
          return;
        }

        const orderResponse = await wixClient.orders.searchOrders({
          search: {
            filter: { "buyerInfo.contactId": { $eq: userResponse.member.contactId } },
          },
        });

        setUserData(userResponse.member);
        // Convert Wix orders to our Order type
        setOrders(orderResponse.orders.map((order): Order => ({
          _id: order._id,
          priceSummary: {
            subtotal: {
              amount: order.priceSummary?.subtotal?.amount
            }
          },
          _createdDate: order._createdDate ? new Date(order._createdDate).toISOString() : undefined,
          status: order.status,
        })));
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Profile loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-24 md:min-h-[calc(100vh-180px)] items-start px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl font-semibold mb-8">Profile</h1>
        <form action={updateUser} className="space-y-4">
          <input type="hidden" name="id" value={userData.contactId} />
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              defaultValue={userData.profile?.nickname || ""}
              placeholder="john"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={userData.contact?.firstName || ""}
              placeholder="John"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Surname</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={userData.contact?.lastName || ""}
              placeholder="Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={userData.contact?.phones?.[0] || ""}
              placeholder="+1234567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={userData.loginEmail || ""}
              placeholder="john@gmail.com"
            />
          </div>

          <div className="pt-4">
            <Button type="submit">Update Profile</Button>
          </div>
        </form>
      </div>

      <div className="w-full md:w-1/2">
        <h1 className="text-2xl font-semibold mb-8">Orders</h1>
        <div className="space-y-2">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found</p>
          ) : (
            orders.map((order) => (
              <Link
                href={`/orders/${order._id}`}
                key={order._id}
                className="flex justify-between px-4 py-3 rounded-md hover:bg-green-50 even:bg-slate-100 transition-colors"
              >
                <span className="w-1/4 truncate">{order._id?.substring(0, 10)}...</span>
                <span className="w-1/4">
                  ${parseFloat(order.priceSummary?.subtotal?.amount || '0').toFixed(2)}
                </span>
                {order._createdDate && (
                  <span className="w-1/4">{format(order._createdDate)}</span>
                )}
                <span className="w-1/4">{order.status || 'Unknown'}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 'use client'

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { updateUser } from "@/lib/actions";
// import { wixClientServer } from "@/lib/wixClientServer";
// import { members } from "@wix/members";
// import Link from "next/link";
// import { format } from "timeago.js";

// type UserType = {
//   contactId?: string | null;
//   profile?: {
//     nickname?: string | null;
//   };
//   contact?: {
//     firstName?: string | null;
//     lastName?: string | null;
//     phones?: string[];
//   };
//   loginEmail?: string | null;
// };

// type OrderType = {
//   _id?: string;
//   priceSummary?: {
//     subtotal?: {
//       amount?: number;
//     };
//   };
//   _createdDate?: string;
//   status?: string;
// };

// export default function ProfilePage() {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [orders, setOrders] = useState<OrderType[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserAndOrders = async () => {
//       const wixClient = await wixClientServer();

//       try {
//         const userRes = await wixClient.members.getCurrentMember({
//           fieldsets: [members.Set.FULL],
//         });

//         if (!userRes.member?.contactId) {
//           setLoading(false);
//           return;
//         }

//         const orderRes = await wixClient.orders.searchOrders({
//           search: {
//             filter: { "buyerInfo.contactId": { $eq: userRes.member.contactId } },
//           },
//         });

//         setUser({
//           contactId: userRes.member.contactId,
//           profile: {
//             nickname: userRes.member.profile?.nickname || undefined,
//           },
//           contact: {
//             firstName: userRes.member.contact?.firstName || undefined,
//             lastName: userRes.member.contact?.lastName || undefined,
//             phones: userRes.member.contact?.phones || [],
//           },
//           loginEmail: userRes.member.loginEmail || undefined,
//         });
//         setOrders(orderRes.orders);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserAndOrders();
//   }, []);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (!user) {
//     return <div className="flex justify-center items-center h-screen">Not logged in!</div>;
//   }

//   return (
//     <div className="flex flex-col md:flex-row gap-24 md:h-[calc(100vh-180px)] items-start px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
//       <div className="w-full md:w-1/2">
//         <h1 className="text-3xl font-bold mb-8">Profile</h1>
//         <form action={updateUser} className="space-y-6">
//           <input type="hidden" name="id" value={user.contactId || ""} />
          
//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               name="username"
//               defaultValue={user.profile?.nickname || ""}
//               placeholder="john"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="firstName">First Name</Label>
//             <Input
//               id="firstName"
//               name="firstName"
//               defaultValue={user.contact?.firstName || ""}
//               placeholder="John"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="lastName">Surname</Label>
//             <Input
//               id="lastName"
//               name="lastName"
//               defaultValue={user.contact?.lastName || ""}
//               placeholder="Doe"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone</Label>
//             <Input
//               id="phone"
//               name="phone"
//               defaultValue={user.contact?.phones?.[0] || ""}
//               placeholder="+1234567"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="email">E-mail</Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               defaultValue={user.loginEmail || ""}
//               placeholder="john@example.com"
//             />
//           </div>
          
//           <Button type="submit">Update Profile</Button>
//         </form>
//       </div>
      
//       <div className="w-full md:w-1/2">
//         <h1 className="text-3xl font-bold mb-8">Orders</h1>
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <Link
//               href={`/orders/${order._id}`}
//               key={order._id}
//               className="flex justify-between items-center px-4 py-3 rounded-md hover:bg-green-50 even:bg-slate-100 transition-colors"
//             >
//               <span className="w-1/4 truncate">{order._id?.substring(0, 10)}...</span>
//               <span className="w-1/4">${order.priceSummary?.subtotal?.amount?.toFixed(2) || '0.00'}</span>
//               {order._createdDate && (
//                 <span className="w-1/4">{format(order._createdDate)}</span>
//               )}
//               <span className="w-1/4">{order.status || 'Unknown'}</span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

