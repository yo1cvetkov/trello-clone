"use client";

import Link from "next/link";

import { Plus, PlusIcon } from "lucide-react";

import { useLocalStorage } from "usehooks-ts";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavItem, Organization } from "./nav-item";

interface SidebarProps {
  storageKey?: string;
}

export function Sidebar({ storageKey = "t-sidebar-state" }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const { organization: activeOrganization, isLoaded: isLoadedOrganization } =
    useOrganization();

  const { userMemberships, isLoaded: isLoadedOrganizationList } =
    useOrganizationList({
      userMemberships: {
        infinite: true,
      },
    });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    []
  );

  function onExpand(id: string) {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  }

  if (
    !isLoadedOrganization ||
    !isLoadedOrganizationList ||
    userMemberships.isLoading
  ) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size={"icon"}
          variant={"ghost"}
          className="ml-auto"
        >
          <Link href={"/select-org"}>
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id}
            isExpanded={expanded[organization.id]}
            organization={organization as Organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
}
