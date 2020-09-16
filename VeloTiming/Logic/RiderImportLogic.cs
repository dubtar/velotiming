using System.Threading.Tasks;
using VeloTiming.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace VeloTiming.Logic
{
    public interface IRiderImportLogic
    {
        Task<string> Import(int raceId, string content, RiderImportColumnType[] columnTypes, bool ignoreFirstRow);
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RiderImportColumnType
    {
        Skip,
        Lastname,
        FirstName,
        LastFirstName,
        FirstLastName,
        Sex,
        Year,
        City,
        Team
    }

    public class RiderImportLogic : IRiderImportLogic
    {
        private readonly DataContext dataContext;

        public RiderImportLogic(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public async Task<string> Import(int raceId, string content, RiderImportColumnType[] columnTypes, bool ignoreFirstRow)
        {
            int added = 0,
                failed = 0,
                existed = 0;

            const string SEPARATOR = ";";

            Race race = await dataContext.Races.Include(r => r.Categories).FirstOrDefaultAsync(r => r.Id == raceId);
            if (race == null) throw new System.Exception($"Race not found by Id: {raceId}");

            var allRiders = await dataContext.Riders.Where(r => r.RaceId == raceId).ToListAsync();

            var rows = content.Split('\n');
            if (ignoreFirstRow)
                rows = rows.Skip(1).ToArray();

            foreach (var row in rows)
            {
                var items = row.Split(SEPARATOR);
                Rider rider = new Rider();
                for (var i = 0; i < columnTypes.Length; i++)
                {
                    if (items.Length <= i) break;
                    string value = items[i];
                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        switch (columnTypes[i])
                        {
                            case RiderImportColumnType.City: rider.City = value; break;
                            case RiderImportColumnType.FirstLastName:
                                var splited = value.Split(' ', 2, System.StringSplitOptions.RemoveEmptyEntries);
                                if (splited.Length == 2)
                                {
                                    rider.FirstName = splited[0].Trim();
                                    rider.LastName = splited[1].Trim();
                                }
                                break;
                            case RiderImportColumnType.FirstName: rider.FirstName = value.Trim(); break;
                            case RiderImportColumnType.Lastname: rider.LastName = value.Trim(); break;
                            case RiderImportColumnType.LastFirstName:
                                splited = value.Split(' ', 2, System.StringSplitOptions.RemoveEmptyEntries);
                                if (splited.Length == 2)
                                {
                                    rider.LastName = splited[0].Trim();
                                    rider.FirstName = splited[1].Trim();
                                }
                                break;
                            case RiderImportColumnType.Sex:
                                rider.Sex = items[i].StartsWith("ж", System.StringComparison.CurrentCultureIgnoreCase) ? Sex.Female : Sex.Male;
                                break;
                            case RiderImportColumnType.Team: rider.Team = value; break;
                            case RiderImportColumnType.Year:
                                if (int.TryParse(value, out int year) && year > 1900 && year < System.DateTime.Now.Year)
                                    rider.YearOfBirth = year;
                                break;
                        }
                    }
                }
                if (string.IsNullOrWhiteSpace(rider.FirstName) || string.IsNullOrWhiteSpace(rider.LastName))
                    failed++;
                else
                {
                    var existingRider = allRiders.FirstOrDefault(r => r.FirstName.Equals(rider.FirstName, StringComparison.CurrentCultureIgnoreCase)
                        && r.LastName.Equals(rider.LastName, StringComparison.CurrentCultureIgnoreCase));
                    if (existingRider == null)
                    {
                        rider.RaceId = raceId;
                        // determine category
                        SetRiderCategory(rider, race.Categories);
                        dataContext.Add(rider);
                        added++;
                    }
                    else
                    {
                        // update only City and Team if set
                        if (!string.IsNullOrWhiteSpace(rider.City))
                            existingRider.City = rider.City;
                        if (!string.IsNullOrWhiteSpace(rider.Team))
                            existingRider.Team = rider.Team;
                        dataContext.Update(existingRider);
                        existed++;
                    }
                }
            }

            await dataContext.SaveChangesAsync();

            string result = $"Всего: {added + existed + failed}Добавлено: {added}";
            if (existed > 0)
                result += $", повторов: {existed}";
            if (failed > 0)
                result += $", игнорировано: {failed}";
            return result;
        }

        private void SetRiderCategory(Rider rider, IEnumerable<RaceCategory> categories)
        {
            rider.Category = categories.FirstOrDefault(cat => 
                (cat.MinYearOfBirth != null || cat.MaxYearOfBirth != null) // skip categories without years
                && 
                     cat.Sex == rider.Sex &&
                    (cat.MinYearOfBirth == null || cat.MinYearOfBirth <= rider.YearOfBirth) &&
                    (cat.MaxYearOfBirth == null || cat.MaxYearOfBirth >= rider.YearOfBirth)
            );
        }
    }
}