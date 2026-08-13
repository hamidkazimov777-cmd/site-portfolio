import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projectCount, publishedCount, skillCount, experienceCount, messageCount, unreadCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "PUBLISHED" } }),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } }),
    ]);

  const stats = [
    { label: "Projects", value: projectCount, href: "/control/projects" },
    { label: "Published", value: publishedCount, href: "/control/projects" },
    { label: "Skills", value: skillCount, href: "/control/skills" },
    { label: "Experience entries", value: experienceCount, href: "/control/experience" },
    { label: "Messages", value: messageCount, href: "/control/messages" },
    { label: "Unread messages", value: unreadCount, href: "/control/messages" },
  ];

  const recentMessages = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your site content.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-accent">
              <CardHeader>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                {stat.label}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-medium text-foreground">Recent messages</h2>
        <div className="mt-4 space-y-3">
          {recentMessages.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          )}
          {recentMessages.map((message) => (
            <Card key={message.id}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {message.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      &lt;{message.email}&gt;
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {message.message}
                  </p>
                </div>
                {!message.read && (
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
