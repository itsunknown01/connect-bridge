import { db } from "@/lib/db";
import { userProfile } from "@/lib/user-profile";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface inviteCodeProps {
    params: {
        inviteCode: string
    }
}

const inviteCodePage = async ({
    params
}: inviteCodeProps) => {
    const profile = await userProfile();
    
    if (!profile) {
        return redirectToSignIn()
    }

    if (!params.inviteCode) {
        redirect('/channels')
    }

    const existingserver = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingserver) {
        return redirect(`/channels/${existingserver.id}`)
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    })

    if (server) {
        return redirect(`/channels/${server.id}`)
    }

    return null
}

export default inviteCodePage;