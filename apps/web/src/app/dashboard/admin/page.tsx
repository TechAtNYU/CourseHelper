"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "@dev-team-fall-25/server/convex/_generated/api";
import type { Doc } from "@dev-team-fall-25/server/convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ConfigDialog } from "./components/config-dialog";
import { ConfigTable } from "./components/config-table";

export default function AdminPage() {
  const { user } = useUser();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const isAdmin = user?.publicMetadata?.is_admin;

  const configs = useQuery(
    api.appConfigs.getAllAppConfigs,
    isAuthenticated && isAdmin ? {} : "skip",
  );
  const setConfig = useMutation(api.appConfigs.setAppConfig);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editingValues, setEditingValues] = useState<
    Doc<"appConfigs"> | undefined
  >(undefined);

  if (isAuthenticated && !isAdmin) {
    router.push("/dashboard");
    return null;
  }

  if (isLoading || !isAuthenticated || !configs) {
    return <Spinner />;
  }

  async function onSaveConfig(key: string, value: string) {
    await setConfig({ key, value });
  }

  const handleAdd = () => {
    setMode("add");
    setEditingValues(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (config: Doc<"appConfigs">) => {
    setMode("edit");
    setEditingValues(config);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleAdd} size="sm">
        <Plus className="size-4" />
        Add
      </Button>

      {configs && configs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No configurations found. Click "Add" to create one.
          </CardContent>
        </Card>
      ) : null}
      <ConfigTable data={configs} onEdit={handleEdit} />

      <ConfigDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingValues(undefined);
          }
        }}
        mode={mode}
        initial={editingValues}
        onSubmit={onSaveConfig}
      />
    </div>
  );
}
