import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { BuildActivity } from '../../backend';

export function useGetBuildHistory() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<BuildActivity[]>({
    queryKey: ['buildHistory', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const principal = identity.getPrincipal();
      return actor.getBuildHistory(principal);
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useRecordBuild() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ prompt, artifactUri }: { prompt: string; artifactUri: string }) => {
      if (!actor || !identity) {
        throw new Error('Not authenticated');
      }
      await actor.recordBuild(prompt, artifactUri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildHistory'] });
    },
  });
}
