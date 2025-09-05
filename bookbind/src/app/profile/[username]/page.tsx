"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { toast } from 'sonner';
import { getLaters } from '@/actions/user.action';

type Later = {
  id: string,
  googleId: string,
  title: string,
  author: string | null,
  path: string | null
}

function ProfilePage({ params }: { params: { username: string } }) {
  const [laters, setLaters] = useState<Later[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLaters = async () => {
      try {
        const data = await getLaters();
        if (data) {
          setLaters(data);
        }
      } catch (error) {
        toast("Failed to fetch reading list");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLaters();
  }, [])

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reading List</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="h-[calc(100vh-12rem)] pt-2">
        <div className="grid grid-cols-3 gap-2">
          {laters.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No books added yet!
            </div>
          ) : (
            laters.map((later) => (
              <div key={later.id} className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                  <div className="p-4 flex-1 flex flex-col justify-between text-center">
                    {later.path ? (
                      <Image
                        src={`https://books.google.com/books/content?id=${later.googleId}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}
                        width={200}
                        height={300}
                        alt={`${later.title} cover`}
                        className="object-cover mx-auto"
                      />
                    ) : (
                      <div className="h-[300px] flex items-center justify-center bg-muted text-muted-foreground">
                        No cover
                      </div>
                    )}
                    <div className="mt-2">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {later.title}
                      </CardTitle>
                      {later.author && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {later.author}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ProfilePage;