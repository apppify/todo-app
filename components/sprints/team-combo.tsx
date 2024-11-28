'use client';

import { use, useState } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Team } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

type TeamComboProps = {
  teams: Promise<Team[]>;
  value?: number;
  onChange?: (teamId: number | undefined) => void;
};

export const TeamCombo: React.FC<TeamComboProps> = ({ teams: getTeams, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const teams = use(getTeams);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] w-full justify-between"
        >
          {value ? teams.find((team) => team.id === value)?.name : 'All teams'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.id.toString()}
                  onSelect={(newValue) => {
                    onChange?.(newValue === value?.toString() ? undefined : +newValue);
                    setOpen(false);
                  }}
                >
                  {team.name}
                  <Check
                    className={cn('ml-auto', value === team.id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
