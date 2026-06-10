import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { rankingsService } from '../../services/rankings.service';
import { getInitials, getAvatarColor, getAvatarTextColor } from '../../utils/format';
import { useAuth } from '../../contexts/AuthContext';
import type { RankingEntry } from '../../types';

const FILTERS = ['Tháng này', 'Tháng trước', '3 tháng', 'Toàn bộ'];

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export const RankingsPage: FC = () => {
  const { user } = useAuth();
  const [filterTab, setFilterTab] = useState(0);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rankingsService.list()
      .then((res) => setRankings(res.data))
      .catch(() => setRankings([]))
      .finally(() => setLoading(false));
  }, []);

  const currentUserRank = rankings.find((r) => r.memberId === user?.id);
  const showFooter = !currentUserRank && user && rankings.length > 0;

  return (
    <Box>
      {/* Page Header */}
      <Typography variant="h2" sx={{ mb: 0.5 }}>Bảng xếp hạng</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Top thành viên tham gia nhiều nhất.
      </Typography>

      {/* Filter Tabs */}
      <Tabs
        value={filterTab}
        onChange={(_e, v) => setFilterTab(v)}
        sx={{
          mb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minHeight: 42, fontSize: '0.875rem' },
        }}
        variant="scrollable"
        scrollButtons={false}
      >
        {FILTERS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty */}
      {!loading && rankings.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Chưa có dữ liệu xếp hạng.
          </Typography>
        </Box>
      )}

      {!loading && rankings.length > 0 && (
        <>
      {/* Top 3 Podium */}
      {rankings.length >= 3 && (
        <Card sx={{ mb: 2, bgcolor: 'primary.main', color: '#fff' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 3 }}>
              {/* 2nd place */}
              <Box sx={{ textAlign: 'center', flex: 1, pb: 1 }}>
                <TrophyIcon sx={{ fontSize: '1.5rem', mb: 0.5, color: MEDAL_COLORS[1] }} />
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: getAvatarColor(rankings[1].member.displayName),
                    color: getAvatarTextColor(rankings[1].member.displayName),
                    fontWeight: 600,
                    mx: 'auto',
                    mb: 1,
                    border: `3px solid ${MEDAL_COLORS[1]}`,
                  }}
                >
                  {getInitials(rankings[1].member.displayName)}
                </Avatar>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, display: 'block', lineHeight: 1.3 }} noWrap>
                  {rankings[1].member.displayName.split(' ').pop()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {rankings[1].sessionCount} buổi
                </Typography>
              </Box>

              {/* 1st place — taller */}
              <Box sx={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                <TrophyIcon sx={{ fontSize: '2rem', mb: 0.5, color: MEDAL_COLORS[0] }} />
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: getAvatarColor(rankings[0].member.displayName),
                    color: getAvatarTextColor(rankings[0].member.displayName),
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    mx: 'auto',
                    mb: 1,
                    border: `3px solid ${MEDAL_COLORS[0]}`,
                    boxShadow: `0 0 0 2px ${MEDAL_COLORS[0]}40`,
                  }}
                >
                  {getInitials(rankings[0].member.displayName)}
                </Avatar>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700, display: 'block', lineHeight: 1.3 }} noWrap>
                  {rankings[0].member.displayName.split(' ').pop()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {rankings[0].sessionCount} buổi
                </Typography>
              </Box>

              {/* 3rd place */}
              <Box sx={{ textAlign: 'center', flex: 1, pb: 2 }}>
                <TrophyIcon sx={{ fontSize: '1.5rem', mb: 0.5, color: MEDAL_COLORS[2] }} />
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: getAvatarColor(rankings[2].member.displayName),
                    color: getAvatarTextColor(rankings[2].member.displayName),
                    fontWeight: 600,
                    mx: 'auto',
                    mb: 1,
                    border: `3px solid ${MEDAL_COLORS[2]}`,
                  }}
                >
                  {getInitials(rankings[2].member.displayName)}
                </Avatar>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, display: 'block', lineHeight: 1.3 }} noWrap>
                  {rankings[2].member.displayName.split(' ').pop()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {rankings[2].sessionCount} buổi
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Full rank list */}
      <Card>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <List disablePadding>
            {rankings.map((entry, idx) => {
              const isMe = entry.memberId === user?.id;
              return (
                <Box key={entry.memberId}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: isMe ? '#F1F8E9' : 'transparent',
                    }}
                  >
                    {/* Rank number */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mr: 1.5,
                      }}
                    >
                      {idx < 3 ? (
                        <TrophyIcon sx={{ fontSize: '1.2rem', color: MEDAL_COLORS[idx] }} />
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', width: 24, textAlign: 'center' }}>
                          {entry.rank}
                        </Typography>
                      )}
                    </Box>

                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: getAvatarColor(entry.member.displayName),
                          color: getAvatarTextColor(entry.member.displayName),
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(entry.member.displayName)}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {entry.member.displayName}
                          </Typography>
                          {isMe && (
                            <Chip label="Bạn" size="small" sx={{ bgcolor: '#E8F5E9', color: 'primary.main', height: 18, fontSize: '0.65rem' }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {entry.sessionCount} buổi
                        </Typography>
                      }
                    />

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {entry.sessionCount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>buổi</Typography>
                    </Box>
                  </ListItem>
                  {idx < rankings.length - 1 && <Divider component="li" />}
                </Box>
              );
            })}
          </List>

          {/* Footer: current user rank if not in top 10 */}
          {showFooter && (
            <>
              <Divider />
              <Box sx={{ px: 2, py: 1.5, bgcolor: '#F1F8E9', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrophyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Vị trí của bạn chưa nằm trong top {rankings.length}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
      </>
      )}
    </Box>
  );
};
